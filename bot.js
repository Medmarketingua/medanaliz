const BOT_TOKEN = '8950197966:AAFuKGdt1Y_WFC1mLNlKkC3S7H0OywX-Flo';
const SITE_URL = 'https://medanaliz-cpmsd2.netlify.app';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 200, body: 'Bot Active' };
  }

  const update = JSON.parse(event.body);
  
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const data = cb.data;
    
    if (data.startsWith('sym_')) {
      const symptomData = SYMPTOMS_DATA[data.replace('sym_', '')];
      if (symptomData) {
        await sendMessage(chatId,
          symptomData.icon + ' *' + esc(symptomData.name) + '*\n\n' +
          'Рекомендовані аналізи:\n' +
          symptomData.tests + '\n' +
          '💉 Венопункція — 63 грн\n\n' +
          '*Разом: ' + symptomData.total + ' грн*',
          { reply_markup: { inline_keyboard: [
            [{ text: '📋 Замовити ці аналізи', web_app: { url: SITE_URL } }],
            [{ text: '← Інший симптом', callback_data: 'back_symptoms' }]
          ]}}
        );
      }
    }
    else if (data === 'back_symptoms') {
      await sendMessage(chatId, '🩺 *Що вас турбує?*\n\nОберіть симптом:', symptomsKeyboard());
    }
    
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: cb.id })
    });
    
    return { statusCode: 200, body: 'OK' };
  }

  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text || '';

    if (text === '/start') {
      await sendMessage(chatId,
        '🏥 *Вітаємо в МедАналіз\\!*\n\n' +
        'Замовлення платних лабораторних аналізів\n' +
        'КНП ЦПМСД №2 Дарницького району м\\. Києва\n\n' +
        '💰 Ціни на 25\\-50% нижче ніж у приватних\n' +
        '⚡ Результати в день здачі у Хелсі\n\n' +
        'Оберіть дію 👇',
        startKeyboard()
      );
    }
    else if (text === '/catalog' || text === '🔬 Каталог аналізів') {
      await sendMessage(chatId,
        '🔬 *Каталог аналізів*\n\n' +
        '70\\+ лабораторних досліджень:\n' +
        '🩸 Кров · 🧪 Біохімія · 🦋 Гормони\n' +
        '💧 Сеча · 🔬 Кал · 🩹 Коагулограма',
        { reply_markup: { inline_keyboard: [
          [{ text: '📋 Відкрити каталог', web_app: { url: SITE_URL } }]
        ]}}
      );
    }
    else if (text === '/packages' || text === '📦 Готові пакети') {
      await sendMessage(chatId,
        '📦 *Готові пакети*\n\n' +
        '*Скринінг 40\\+:*\n' +
        '👩 Жіноче здоров\\'я — 1 446 грн\n' +
        '👨 Чоловіче здоров\\'я — 1 768 грн\n' +
        '🏥 Щорічний контроль — 2 353 грн\n\n' +
        '*За станом:*\n' +
        '🩺 Базовий чекап — 915 грн\n' +
        '🦋 Щитоподібна — 913 грн\n' +
        '🫀 Ліпідний профіль — 615 грн\n' +
        '🫁 Печінковий профіль — 877 грн\n' +
        '💉 Діабет\\-контроль — 723 грн\n' +
        '🩹 Коагулограма — 665 грн\n' +
        '🩸 Анемія — 1 022 грн',
        { reply_markup: { inline_keyboard: [
          [{ text: '📋 Обрати на сайті', web_app: { url: SITE_URL } }]
        ]}}
      );
    }
    else if (text === '/symptoms' || text === '🩺 За симптомами') {
      await sendMessage(chatId, '🩺 *Що вас турбує?*\n\nОберіть симптом:', symptomsKeyboard());
    }
    else if (text === '/pay' || text === '💳 Оплата') {
      await sendMessage(chatId,
        '💳 *Способи оплати*\n\n' +
        '1️⃣ *Онлайн* — кнопка після замовлення\n' +
        '2️⃣ *QR\\-код* — на бланку замовлення\n' +
        '3️⃣ *Термінал* — реєстратура або каб\\. 106',
        { reply_markup: { inline_keyboard: [
          [{ text: '📋 Замовити аналізи', web_app: { url: SITE_URL } }]
        ]}}
      );
    }
    else if (text === '/help' || text === '❓ Допомога') {
      await sendMessage(chatId,
        '❓ *Як замовити*\n\n' +
        '1️⃣ Оберіть аналізи або пакет\n' +
        '2️⃣ Заповніть ПІБ та телефон\n' +
        '3️⃣ Оплатіть онлайн\n' +
        '4️⃣ Здайте в каб\\. 274\n' +
        '5️⃣ Результати у Хелсі\n\n' +
        '📍 вул\\. Архітектора Вербицького, 5\n' +
        '🕐 08:00–12:00, робочі дні',
        startKeyboard()
      );
    }
    else {
      await sendMessage(chatId, 'Оберіть дію з меню 👇', startKeyboard());
    }
  }

  return { statusCode: 200, body: 'OK' };
};

function startKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        [{ text: '🔬 Каталог аналізів' }, { text: '📦 Готові пакети' }],
        [{ text: '🩺 За симптомами' }, { text: '💳 Оплата' }],
        [{ text: '❓ Допомога' }]
      ],
      resize_keyboard: true
    }
  };
}

function symptomsKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '😴 Втома', callback_data: 'sym_fatigue' }, { text: '🧒 Волосся', callback_data: 'sym_hair' }],
        [{ text: '🦴 Суглоби', callback_data: 'sym_joints' }, { text: '⚖️ Вага', callback_data: 'sym_weight' }],
        [{ text: '🤧 Хворію', callback_data: 'sym_sick' }, { text: '🤍 Шкіра', callback_data: 'sym_skin' }],
        [{ text: '❤️ Серце', callback_data: 'sym_heart' }, { text: '🫁 Печінка', callback_data: 'sym_liver' }],
        [{ text: '🧪 Нирки', callback_data: 'sym_kidney' }, { text: '💧 Набряки', callback_data: 'sym_edema' }],
        [{ text: '😰 Стрес', callback_data: 'sym_stress' }, { text: '🩺 Діабет', callback_data: 'sym_diabetes' }]
      ]
    }
  };
}

const SYMPTOMS_DATA = {
  fatigue: { icon: '😴', name: 'Втома, слабкість', tests: '🩸 ЗАК — 113 грн\n🩸 Феритин — 258 грн\n🩸 Залізо — 129 грн\n🦋 ТТГ — 266 грн\n☀️ Вітамін D — 292 грн\n🧪 Глюкоза — 160 грн', total: '1 281' },
  hair: { icon: '🧒', name: 'Випадає волосся', tests: '🩸 Феритин — 258 грн\n🦋 ТТГ — 266 грн\n🩸 Залізо — 129 грн\n☀️ Вітамін D — 292 грн', total: '1 008' },
  joints: { icon: '🦴', name: 'Болять суглоби', tests: '🧪 СРБ — 62 грн\n🧪 РФ — 208 грн\n🧪 АСЛО — 82 грн\n🧪 Сечова кислота — 147 грн\n🩸 ШОЕ — 36 грн', total: '598' },
  weight: { icon: '⚖️', name: 'Набір / втрата ваги', tests: '🦋 ТТГ — 266 грн\n🦋 Т4 в. — 292 грн\n🧪 Глюкоза — 160 грн\n🧪 HbA1c — 290 грн\n🫀 Холестерин — 151 грн', total: '1 222' },
  sick: { icon: '🤧', name: 'Часто хворію', tests: '🩸 ЗАК — 113 грн\n🩸 ШОЕ — 36 грн\n☀️ Вітамін D — 292 грн\n🧪 Загальний білок — 138 грн', total: '642' },
  skin: { icon: '🤍', name: 'Проблеми зі шкірою', tests: '🧪 Глюкоза — 160 грн\n🧪 АЛТ — 145 грн\n🧪 Білірубін — 146 грн\n🩸 Феритин — 258 грн\n🦋 ТТГ — 266 грн', total: '1 038' },
  heart: { icon: '❤️', name: 'Серце, тиск', tests: '🫀 Холестерин — 151 грн\n🫀 ЛПВЩ — 200 грн\n🫀 ЛПНЩ — 173 грн\n🫀 Тригліцериди — 28 грн\n🧪 Глюкоза — 160 грн\n🧪 Креатинін — 139 грн', total: '914' },
  liver: { icon: '🫁', name: 'Перевірка печінки', tests: '🧪 АЛТ — 145 грн\n🧪 АСТ — 144 грн\n🧪 Білірубін — 146 грн\n🧪 ГГТ — 125 грн\n🧪 Лужна фосфатаза — 145 грн', total: '768' },
  kidney: { icon: '🧪', name: 'Перевірка нирок', tests: '🧪 Креатинін — 139 грн\n🧪 Сечовина — 147 грн\n💧 Аналіз сечі — 71 грн\n🧪 Сечова кислота — 147 грн', total: '567' },
  edema: { icon: '💧', name: 'Набряки', tests: '🧪 Креатинін — 139 грн\n🧪 Загальний білок — 138 грн\n💧 Аналіз сечі — 71 грн\n🦋 ТТГ — 266 грн', total: '677' },
  stress: { icon: '😰', name: 'Стрес, безсоння', tests: '🦴 Магній — 133 грн\n🦴 Кальцій — 143 грн\n🦋 ТТГ — 266 грн\n🧪 Глюкоза — 160 грн\n🩸 Феритин — 258 грн', total: '1 023' },
  diabetes: { icon: '🩺', name: 'Підозра на діабет', tests: '🧪 Глюкоза — 160 грн\n🧪 HbA1c — 290 грн\n🧪 Креатинін — 139 грн\n💧 Аналіз сечі — 71 грн\n🫀 Холестерин — 151 грн', total: '874' },
};

function esc(text) {
  return text.replace(/[_*\[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

async function sendMessage(chatId, text, extra = {}) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'MarkdownV2', ...extra })
  });
}
