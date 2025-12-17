
import { useEffect, useState } from 'react';

const DailyQuote = () => {
  const [quote, setQuote] = useState('');
  const [meta, setMeta] = useState('');

  useEffect(() => {
    const API = 'https://v1.hitokoto.cn/?encode=json';
    const STORAGE_KEY = 'hitokoto_daily';
    const todayKey = new Date().toISOString().slice(0, 10);

    const render = (obj) => {
      if (!obj) {
        setQuote('获取一言失败。');
        setMeta('');
        return;
      }
      const text = obj.hitokoto || obj.text || JSON.stringify(obj);
      const frm = obj.from ? (obj.from_who ? `${obj.from} — ${obj.from_who}` : obj.from) : (obj.creator || '');
      setQuote(text);
      setMeta(frm ? `— ${frm}` : '');
    };

    const saveToStorage = (data) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey, data }));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    };

    const loadFromStorage = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && parsed.date === todayKey && parsed.data) return parsed.data;
      } catch (e) {
        console.error('Failed to load from localStorage', e);
      }
      return null;
    };

    const cached = loadFromStorage();
    if (cached) {
      render(cached);
      return;
    }

    fetch(API)
      .then(resp => resp.json())
      .then(json => {
        render(json);
        saveToStorage(json);
      })
      .catch(err => {
        console.error(err);
        setQuote('无法加载今日一言，请稍后重试。');
        setMeta('');
      });
  }, []);

  return (
    <div className="mt-2">
      <p id="quote" className="text-sm italic">{quote}</p>
      <p id="meta" className="text-xs text-right mt-1">{meta}</p>
    </div>
  );
};

export default DailyQuote;
