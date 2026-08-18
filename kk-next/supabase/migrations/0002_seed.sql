-- 02-data-model.md — 시드 데이터 (제품 5종, 차량 2대)
insert into products (sku, name_mn, use_mn, price_mnt, band_color) values
 ('WHITE_PUTTY','Цагаан замаск','Гүйцээх өнгөлгөө · дотор хана',13500,'#F4F1E8'),
 ('BLACK_PUTTY','Хар замаск','Суурь тэгшилгээ · түрхэц',9500,'#2A2A2E'),
 ('BLOCK_GLUE','Блокны цавуу','Блок, хөнгөн бетон өрлөг',8900,'#3E9B6B'),
 ('TILE_GLUE','Плитаны цавуу','Плита, керамик наалт',14500,'#3D7DD8'),
 ('KNAUF_GYPSUM','Knauf гипс','Албан ёсны борлуулалт',28000,'#0A9BDC');

insert into vehicles (model, plate, capacity_kg) values
 ('Майти','01-23 УБА',3500),
 ('Портер','45-67 УНА',1500);

-- drivers: Ганбаа(Майти), Дорж(Портер) — user_id는 Auth 계정 생성 후 연결
insert into drivers (name, phone, vehicle_id)
select 'Ганбаа', '9900-0001', id from vehicles where model = 'Майти';
insert into drivers (name, phone, vehicle_id)
select 'Дорж', '9900-0002', id from vehicles where model = 'Портер';
