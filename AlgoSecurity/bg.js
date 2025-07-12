const GIST_URL = "https://jsonalgosecure.netlify.app/rules.json";

async function hardUpdate() {
  try {
    console.log("Запуск обновления правил...");
    const res = await fetch(`${GIST_URL}?t=${Date.now()}`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    
    const rules = await res.json();
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRules.map(rule => rule.id),
      addRules: rules
    });
    
    console.log(`✓ Правила обновлены (${new Date().toLocaleTimeString()})`);
  } catch (err) {
    console.error("✗ Ошибка:", err);
  }
}

// Инициализация
chrome.runtime.onInstalled.addListener(() => {
  console.log("Расширение установлено!");
  chrome.alarms.create('5sec', { periodInMinutes: 0.08333 });
});

chrome.alarms.onAlarm.addListener(hardUpdate);

// Первое обновление
hardUpdate();