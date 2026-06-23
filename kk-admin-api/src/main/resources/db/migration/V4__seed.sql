-- 시드 데이터 (기술설계.md 부록 B, §3.6)

-- 카테고리 4종
INSERT INTO category (name, icon_key, sort_order) VALUES
  ('Дотор замаск',     'trowel', 1),
  ('Фасадны замаск',   'wall',   2),
  ('Плитан цавуу',     'layers', 3),
  ('Knauf материал',   'box',    4);

-- 제품 9종
INSERT INTO product (sku, name, brand, category_id, price, pack, stock) VALUES
  ('SKU-1001', 'Цагаан финиш замаск 25кг',          NULL,    (SELECT id FROM category WHERE name='Дотор замаск'),   38000, '25 кг шуудай', 88),
  ('SKU-1002', 'Цагаан старт замаск 25кг',          NULL,    (SELECT id FROM category WHERE name='Дотор замаск'),   32000, '25 кг шуудай', 64),
  ('SKU-1003', 'Фасадны хар замаск 25кг',           NULL,    (SELECT id FROM category WHERE name='Фасадны замаск'), 36000, '25 кг шуудай', 40),
  ('SKU-1004', 'Фасадны цагаан финиш замаск 25кг',  NULL,    (SELECT id FROM category WHERE name='Фасадны замаск'), 45000, '25 кг шуудай', 22),
  ('SKU-1005', 'Плитан цавуу энгийн 25кг',          NULL,    (SELECT id FROM category WHERE name='Плитан цавуу'),   28000, '25 кг шуудай', 9),
  ('SKU-1006', 'Плитан цавуу уян хатан 25кг',       NULL,    (SELECT id FROM category WHERE name='Плитан цавуу'),   42000, '25 кг шуудай', 30),
  ('SKU-1007', 'Knauf Fugen 5кг',                   'Knauf', (SELECT id FROM category WHERE name='Knauf материал'), 18000, '5 кг шуудай',  120),
  ('SKU-1008', 'Knauf Fugen 25кг',                  'Knauf', (SELECT id FROM category WHERE name='Knauf материал'), 72000, '25 кг шуудай', 0),
  ('SKU-1009', 'Knauf Uniflott 25кг',               'Knauf', (SELECT id FROM category WHERE name='Knauf материал'), 95000, '25 кг шуудай', 15);

-- 원자재 7종
INSERT INTO material (name, unit, default_price) VALUES
  ('Гипс',             'кг', 800),
  ('Цемент',           'кг', 450),
  ('Шохойн нунтаг',    'кг', 350),
  ('Полимер нэмэлт',   'кг', 4500),
  ('Целлюлозын эфир',  'кг', 12000),
  ('Кварцын элс',      'кг', 280),
  ('Савлагааны шуудай', 'ш', 600);

-- 공급처 (예시)
INSERT INTO supplier (name, phone) VALUES
  ('Дархан гипс ХХК',  '7000-1234'),
  ('Эрдэнэт цемент ХК', '7000-5678');

-- app_setting 기본값
INSERT INTO app_setting (key, value) VALUES
  ('free_delivery_threshold', '100000'),
  ('company_name',            'Kokorozashi Kibou LLC'),
  ('company_phone',           '7700-0000'),
  ('telegram_enabled',        'false'),
  ('telegram_admin_chat_id',  ''),
  ('notify_new_order',        'true'),
  ('notify_new_quote',        'true');
