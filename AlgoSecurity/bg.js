const GIST_URL = "https://gist.githubusercontent.com/sadf2000/1218255c4594a5f8e67b48134e01b895/raw/rules.json";

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