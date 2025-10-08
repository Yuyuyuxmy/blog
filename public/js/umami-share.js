(function (global) {
  const cacheKey = 'umami-share-cache';
  const cacheTTL = 3600_000; // 1h

  async function fetchShareData(baseUrl, shareId) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < cacheTTL) {
          console.log('[Umami] 使用缓存的分享数据');
          return parsed.value;
        }
      } catch (error) {
        console.warn('[Umami] 清理无效缓存:', error);
        localStorage.removeItem(cacheKey);
      }
    }
    
    const shareUrl = `${baseUrl}/analytics/us/api/share/${shareId}`;
    console.log('[Umami] 获取分享信息:', shareUrl);
    
    const res = await fetch(shareUrl);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('[Umami] 获取分享信息失败:', {
        status: res.status,
        statusText: res.statusText,
        url: shareUrl,
        response: errorText
      });
      throw new Error(`获取 Umami 分享信息失败: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('[Umami] 分享信息获取成功:', { websiteId: data.websiteId, tokenLength: data.token?.length });
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), value: data }));
    return data;
  }

  /**
   * 获取 Umami 分享数据（websiteId、token）
   * 在缓存 TTL 内复用；并用全局 Promise 避免并发请求
   * @param {string} baseUrl
   * @param {string} shareId
   * @returns {Promise<{websiteId: string, token: string}>}
   */
  global.getUmamiShareData = function (baseUrl, shareId) {
    if (!global.__umamiSharePromise) {
      global.__umamiSharePromise = fetchShareData(baseUrl, shareId).catch((err) => {
        delete global.__umamiSharePromise;
        throw err;
      });
    }
    return global.__umamiSharePromise;
  };

  global.clearUmamiShareCache = function () {
    localStorage.removeItem(cacheKey);
    delete global.__umamiSharePromise;
  };
})(window);