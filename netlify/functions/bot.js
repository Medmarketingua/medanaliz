const BOT_TOKEN = '8950197966:AAFuKGdt1Y_WFC1mLNlKkC3S7H0OywX-Flo';
const SITE_URL = 'https://medanaliz-cpmsd2.netlify.app';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('МедАналіз Bot Active', { status: 200 });
  }

  const update = await request.json();
  
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text || '';
    
    if (text === '/start') {
      await sendMessage(chatId, 
        '🏥 *Вітаємо в МедАналіз\\!*\n\n' +
        'Замовлення платних лабораторних аналізів\n' +
        'КНП ЦПМСД №2 Дарницького району м\\. Києва\n\n' +
        '💰 Ціни на 25\\-50% нижче ніж у приватних лабораторіях\n' +
        '⚡ Результати в день здачі у Хелсі\n\n' +
        'Оберіть дію:',
        startKeyboard()
      );
    }
    else if (text === '/catalog' || text === '🔬 Каталог аналізів') {
      await sendMessage(chatId,
        '🔬 *Каталог аналізів*\n\n' +
        'Більше 70 лабораторних досліджень:\n' +
        '🩸 Кров\n' +
        '🧪 Біохімія\n' +
        '🦋 Гормони\n' +
        '💧 Сеча\n' +
        '🔬 Кал\n' +
        '🩹 Коагулограма\n\n' +
        'Натисніть кнопку нижче щоб відкрити каталог:',
        webAppButton('📋 Відкрити каталог', SITE_URL)
      );
    }
    else if (text === '/packages' || text === '📦 Готові пакети') {
      await sendMessage(chatId,
        '📦 *Готові пакети аналізів*\n\n' +
        '*Скринінг 40\\+:*\n' +
        '👩 Жіноче здоров\\'я 40\\+ — 1 446 грн\n' +
        '👨 Чоловіче здоров\\'я 40\\+ — 1 768 грн\n' +
        '🏥 Щорічний контроль 40\\+ — 2 353 грн\n\n' +
        '*За станом здоров\\'я:*\n' +
        '🩺 Базовий чекап — 915 грн\n' +
        '🦋 Щитоподібна залоза — 913 грн\n' +
        '🫀 Ліпідний профіль — 615 грн\n' +
        '🫁 Печінковий профіль — 877 грн\n' +
        '💉 Діабет\\-контроль — 723 грн\n' +
        '🩹 Коагулограма базова — 665 грн\n' +
        '🩸 Анемія — 1 022 грн\n\n' +
        'Оберіть пакет:',
        packagesKeyboard()
      );
    }
    else if (text === '/symptoms' || text === '🩺 За симптомами') {
      await sendMessage(chatId,
        '🩺 *Що вас турбує?*\n\n' +
        'Оберіть симптом — ми підберемо аналізи:',
        symptomsKeyboard()
      );
    }
    else if (text.startsWith('symptom_')) {
      const symptomData = getSymptomData(text.replace('symptom_', ''));
      if (symptomData) {
        await sendMessage(chatId,
          symptomData.icon + ' *' + escapeMarkdown(symptomData.name) + '*\n\n' +
          'Рекомендовані аналізи:\n' +
          symptomData.tests + '\n' +
          '💉 Венопункція — 63 грн\n\n' +
          '*Разом: ' + symptomData.total + ' грн*',
          orderButton(symptomData.id)
        );
      }
    }
    else if (text === '/pay' || text === '💳 Оплата') {
      await sendMessage(chatId,
        '💳 *Способи оплати*\n\n' +
        '1️⃣ *Онлайн* — кнопка «Оплатити» після замовлення\n' +
        '2️⃣ *QR\\-код* — на бланку замовлення\n' +
        '3️⃣ *Термінал* — в реєстратурі або каб\\. 106\n\n' +
        'Оформіть замовлення на сайті:',
        webAppButton('📋 Замовити аналізи', SITE_URL)
      );
    }
    else if (text === '/help' || text === '❓ Допомога') {
      await sendMessage(chatId,
        '❓ *Як замовити аналізи*\n\n' +
        '1️⃣ Оберіть аналізи або пакет\n' +
        '2️⃣ Заповніть ПІБ та телефон\n' +
        '3️⃣ Оплатіть онлайн або в реєстратурі\n' +
        '4️⃣ Здайте аналізи в каб\\. 274\n' +
        '5️⃣ Результати в день здачі у Хелсі\n\n' +
        '📍 вул\\. Архітектора Вербицького, 5, каб\\. 274\n' +
        '🕐 Забір: 08:00–12:00, робочі дні\n\n' +
        '💬 Питання? Напишіть у Viber: \\+380631775534',
        startKeyboard()
      );
    }
    else if (text.startsWith('pkg_')) {
      const pkgId = text.replace('pkg_', '');
      await sendMessage(chatId,
        '✅ Відкрийте сайт щоб додати пакет в кошик:',
        webAppButton('📋 Додати в кошик', SITE_URL + '?pkg=' + pkgId)
      );
    }
    else {
      await sendMessage(chatId,
        'Оберіть дію з меню нижче 👇',
        startKeyboard()
      );
    }
  }

  return new Response('OK', { status: 200 });
}

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

function packagesKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '👩 Жіноче 40+', callback_data: 'x' }, { text: '👨 Чоловіче 40+', callback_data: 'x' }],
        [{ text: '🏥 Щорічний контроль 40+', callback_data: 'x' }],
        [{ text: '🩺 Базовий чекап', callback_data: 'x' }, { text: '🦋 Щитоподібна', callback_data: 'x' }],
        [{ text: '📋 Відкрити на сайті', web_app: { url: SITE_URL } }]
      ]
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

function webAppButton(text, url) {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: text, web_app: { url: url } }]
      ]
    }
  };
}

function orderButton(symptomId) {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📋 Замовити ці аналізи', web_app: { url: SITE_URL } }],
        [{ text: '← Інший симптом', callback_data: 'back_symptoms' }]
      ]
    }
  };
}

const SYMPTOMS_DATA = {
  fatigue: { icon: '😴', name: 'Втома, слабкість', tests: '🩸 ЗАК — 113 грн\n🩸 Феритин — 258 грн\n🩸 Залізо — 129 грн\n🦋 ТТГ — 266 грн\n☀️ Вітамін D — 292 грн\n🧪 Глюкоза — 160 грн', total: '1 281', id: 'fatigue' },
  hair: { icon: '🧒', name: 'Випадає волосся', tests: '🩸 Феритин — 258 грн\n🦋 ТТГ — 266 грн\n🩸 Залізо — 129 грн\n☀️ Вітамін D — 292 грн', total: '1 008', id: 'hair' },
  joints: { icon: '🦴', name: 'Болять суглоби', tests: '🧪 СРБ — 62 грн\n🧪 РФ — 208 грн\n🧪 АСЛО — 82 грн\n🧪 Сечова кислота — 147 грн\n🩸 ШОЕ — 36 грн', total: '598', id: 'joints' },
  weight: { icon: '⚖️', name: 'Набір / втрата ваги', tests: '🦋 ТТГ — 266 грн\n🦋 Т4 в. — 292 грн\n🧪 Глюкоза — 160 грн\n🧪 HbA1c — 290 грн\n🫀 Холестерин — 151 грн', total: '1 222', id: 'weight' },
  sick: { icon: '🤧', name: 'Часто хворію', tests: '🩸 ЗАК — 113 грн\n🩸 ШОЕ — 36 грн\n☀️ Вітамін D — 292 грн\n🧪 Загальний білок — 138 грн', total: '642', id: 'sick' },
  skin: { icon: '🤍', name: 'Проблеми зі шкірою', tests: '🧪 Глюкоза — 160 грн\n🧪 АЛТ — 145 грн\n🧪 Білірубін — 146 грн\n🩸 Феритин — 258 грн\n🦋 ТТГ — 266 грн', total: '1 038', id: 'skin' },
  heart: { icon: '❤️', name: 'Серце, тиск', tests: '🫀 Холестерин — 151 грн\n🫀 ЛПВЩ — 200 грн\n🫀 ЛПНЩ — 173 грн\n🫀 Тригліцериди — 28 грн\n🧪 Глюкоза — 160 грн\n🧪 Креатинін — 139 грн', total: '914', id: 'heart' },
  liver: { icon: '🫁', name: 'Перевірка печінки', tests: '🧪 АЛТ — 145 грн\n🧪 АСТ — 144 грн\n🧪 Білірубін — 146 грн\n🧪 ГГТ — 125 грн\n🧪 Лужна фосфатаза — 145 грн', total: '768', id: 'liver' },
  kidney: { icon: '🧪', name: 'Перевірка нирок', tests: '🧪 Креатинін — 139 грн\n🧪 Сечовина — 147 грн\n💧 Аналіз сечі — 71 грн\n🧪 Сечова кислота — 147 грн', total: '567', id: 'kidney' },
  edema: { icon: '💧', name: 'Набряки', tests: '🧪 Креатинін — 139 грн\n🧪 Загальний білок — 138 грн\n💧 Аналіз сечі — 71 грн\n🦋 ТТГ — 266 грн', total: '677', id: 'edema' },
  stress: { icon: '😰', name: 'Стрес, безсоння, судоми', tests: '🦴 Магній — 133 грн\n🦴 Кальцій — 143 грн\n🦋 ТТГ — 266 грн\n🧪 Глюкоза — 160 грн\n🩸 Феритин — 258 грн', total: '1 023', id: 'stress' },
  diabetes: { icon: '🩺', name: 'Підозра на діабет', tests: '🧪 Глюкоза — 160 грн\n🧪 HbA1c — 290 грн\n🧪 Креатинін — 139 грн\n💧 Аналіз сечі — 71 грн\n🫀 Холестерин — 151 грн', total: '874', id: 'diabetes' },
};

function getSymptomData(id) {
  return SYMPTOMS_DATA[id] || null;
}

function escapeMarkdown(text) {
  return text.replace(/[_*\[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

async function sendMessage(chatId, text, extra = {}) {
  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: 'MarkdownV2',
    ...extra
  };

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}
