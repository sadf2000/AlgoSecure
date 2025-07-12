const GIST_URL = "https://gist.githubusercontent.com/sadf2000/d826a320a61dc50ebbdcf540bf2a7f44/raw/5433942f4d27db32cc7aa2fe21e18e944bd960e7/rules.json";

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