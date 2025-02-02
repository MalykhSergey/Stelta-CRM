--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17rc1

-- Started on 2025-01-27 17:56:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3479 (class 1262 OID 16384)
-- Name: stelta_crm; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE stelta_crm WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


\connect stelta_crm

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--


--
-- TOC entry 3480 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 890 (class 1247 OID 16530)
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'editor',
    'viewer'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16385)
-- Name: companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying
);


--
-- TOC entry 218 (class 1259 OID 16390)
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.companies ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.companies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 219 (class 1259 OID 16391)
-- Name: contact_persons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_persons (
    id integer NOT NULL,
    name character varying(255) DEFAULT 'Не указан'::character varying NOT NULL,
    phone_number character varying(20) DEFAULT 'Не указан'::character varying NOT NULL,
    email character varying(255) DEFAULT 'Не указан'::character varying NOT NULL,
    company_id integer NOT NULL,
    CONSTRAINT contact_persons_email_check CHECK (((email)::text ~~ '%@%'::text))
);


--
-- TOC entry 220 (class 1259 OID 16400)
-- Name: contact_persons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.contact_persons ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.contact_persons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 16401)
-- Name: document_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_requests (
    id integer NOT NULL,
    date date DEFAULT now() NOT NULL,
    tender_id integer NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 16405)
-- Name: date_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.date_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3481 (class 0 OID 0)
-- Dependencies: 222
-- Name: date_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.date_requests_id_seq OWNED BY public.document_requests.id;


--
-- TOC entry 223 (class 1259 OID 16406)
-- Name: document_requests_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_requests_files (
    id integer NOT NULL,
    name character varying NOT NULL,
    document_request_id integer NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 16411)
-- Name: document_requests_files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.document_requests_files ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.document_requests_files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 16412)
-- Name: rebidding_prices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rebidding_prices (
    tender_id integer NOT NULL,
    price numeric(12,2) DEFAULT 0 NOT NULL,
    id integer NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 16416)
-- Name: rebidding_prices_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rebidding_prices_files (
    id integer NOT NULL,
    name character varying NOT NULL,
    rebidding_price_id integer NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 16421)
-- Name: rebidding_prices_files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.rebidding_prices_files ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rebidding_prices_files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 16422)
-- Name: request_prices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.request_prices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 228
-- Name: request_prices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.request_prices_id_seq OWNED BY public.rebidding_prices.id;


--
-- TOC entry 229 (class 1259 OID 16423)
-- Name: tenders_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenders_files (
    id integer NOT NULL,
    name character varying NOT NULL,
    stage smallint DEFAULT 0 NOT NULL,
    tender_id integer NOT NULL
);


--
-- TOC entry 230 (class 1259 OID 16429)
-- Name: tender_files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tenders_files ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tender_files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 16430)
-- Name: tenders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenders (
    id integer NOT NULL,
    status smallint DEFAULT 0 NOT NULL,
    name character varying DEFAULT 'Полное наименование тендера'::character varying NOT NULL,
    lot_number character varying DEFAULT 'Лот №'::character varying NOT NULL,
    register_number character varying DEFAULT 'Реестровый №'::character varying NOT NULL,
    initial_max_price numeric(12,2) DEFAULT 0 NOT NULL,
    price numeric(12,2) DEFAULT 0 NOT NULL,
    contact_person character varying DEFAULT 'ФИО'::character varying NOT NULL,
    phone_number character varying DEFAULT '+7 '::character varying NOT NULL,
    email character varying DEFAULT 'mail@server.com'::character varying NOT NULL,
    date1_start timestamp without time zone DEFAULT now() NOT NULL,
    date1_finish timestamp without time zone DEFAULT now() NOT NULL,
    date2_finish timestamp without time zone DEFAULT now() NOT NULL,
    comment1 character varying,
    comment2 character varying,
    comment3 character varying,
    comment4 character varying,
    comment5 character varying,
    comment0 character varying,
    contract_number character varying,
    contract_date date,
    company_id integer,
    is_special boolean DEFAULT false NOT NULL,
    date_finish timestamp without time zone DEFAULT now() NOT NULL,
    contact_person_id integer
);


--
-- TOC entry 232 (class 1259 OID 16449)
-- Name: tenders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tenders ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tenders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 16450)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying NOT NULL,
    password character varying NOT NULL,
    salt character varying NOT NULL,
    role public.user_role DEFAULT 'viewer'::public.user_role NOT NULL
);


--
-- TOC entry 234 (class 1259 OID 16455)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3256 (class 2604 OID 16456)
-- Name: document_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_requests ALTER COLUMN id SET DEFAULT nextval('public.date_requests_id_seq'::regclass);


--
-- TOC entry 3259 (class 2604 OID 16457)
-- Name: rebidding_prices id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rebidding_prices ALTER COLUMN id SET DEFAULT nextval('public.request_prices_id_seq'::regclass);


--
-- TOC entry 3456 (class 0 OID 16385)
-- Dependencies: 217
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.companies (id, name) FROM stdin;
46	Соболева Лтд
47	Елисеева Лимитед
48	ООО «Герасимов-Зимин»
49	РАО «Мартынова-Некрасов»
50	ООО «Маслов, Воронцова и Матвеев»
51	АО «Блохина Нестеров»
52	АО «Котов-Калашников»
53	РАО «Зыков-Зыкова»
54	Аксенова и партнеры
55	ОАО «Поляков-Лазарева»
40	ООО «Михайлова Мишина»
36	Уральский банк реконструкции и развития
37	Попов Лтд
38	ООО «Козлов»
39	ООО «Игнатова, Кондратьев и Давыдов»
41	НПО «Калашников»
42	Фомина Инк
44	ОАО «Герасимов, Сергеев и Исаков»
45	ООО «Харитонов-Прохоров»
\.


--
-- TOC entry 3458 (class 0 OID 16391)
-- Dependencies: 219
-- Data for Name: contact_persons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_persons (id, name, phone_number, email, company_id) FROM stdin;
120	777777	123121	213@	38
122	wasd	фы	213@	38
133	Исаков Фома Федотович	8 (922) 738-3373	tamara_2000@example.org	46
134	Зайцева Нинель Борисовна	+7 (487) 400-8731	natan_2003@example.com	46
135	Евгений Феофанович Марков	+7 (153) 539-7219	loginovpavel@example.org	46
136	Лидия Андреевна Русакова	+7 804 676 82 05	boleslav64@example.com	46
137	Денисов Савелий Брониславович	8 (206) 958-77-45	gerasim_2000@example.net	46
138	Комаров Тит Зиновьевич	+73832138466	amos_32@example.org	47
139	Наина Сергеевна Титова	8 151 715 00 19	ikrjukova@example.com	47
140	Казакова Василиса Юрьевна	+7 (053) 513-3677	dementevanikita@example.net	47
141	Евсеева Синклитикия Викторовна	+7 916 521 45 48	ernst55@example.org	47
142	Татьяна Константиновна Воронова	+78125484281	knjazevevlampi@example.net	47
143	Феофан Юлианович Комаров	+7 (368) 687-40-66	samsonovlavrenti@example.org	48
144	Фадей Бенедиктович Кудрявцев	+7 (131) 795-77-64	ustinovafaina@example.com	48
145	Тетерина Кира Харитоновна	+7 441 291 72 99	sigizmundgusev@example.org	48
146	Матвей Феоктистович Панфилов	8 (457) 054-0632	artem1995@example.com	48
147	Тимур Григорьевич Морозов	+7 913 450 13 93	xfedoseev@example.com	48
148	Аксенов Велимир Ярославович	+77534964030	miroslav_07@example.net	49
149	Попова Анжелика Мироновна	8 430 729 98 76	izmail_63@example.net	49
150	Самуил Ефстафьевич Рыбаков	+7 (432) 170-19-76	sofija_1993@example.org	49
151	Азарий Изотович Русаков	+7 697 431 0877	anatolidoronin@example.net	49
152	Акулина Натановна Меркушева	8 (008) 187-48-13	kulakovplaton@example.net	49
153	Ангелина Максимовна Родионова	8 (591) 171-7247	averjan_30@example.net	50
154	Спиридон Аксёнович Рябов	8 (832) 303-70-11	nikita1985@example.net	50
155	Кира Станиславовна Лукина	8 569 414 66 89	kuznetsovsevastjan@example.org	50
156	Прасковья Захаровна Нестерова	86978942432	radovan_1970@example.com	50
157	Виноградова Евгения Ждановна	80183204430	tretjakovmartjan@example.net	50
158	Анжела Владиславовна Романова	8 107 194 4734	smirnovnikanor@example.com	51
159	Колобова Юлия Оскаровна	8 (413) 456-89-06	evdokimmolchanov@example.org	51
160	Константинова Лора Филипповна	+7 (164) 063-6118	cnikolaeva@example.org	51
161	Корнилова Милица Валентиновна	+7 935 030 74 02	golubevgorde@example.com	51
162	Фролов Агафон Арсеньевич	8 788 343 0287	kudrjavtsevaolga@example.com	51
163	Яков Вилорович Калашников	+7 (453) 565-08-18	nikandr78@example.com	52
164	Сергей Ярославович Зиновьев	8 (612) 716-46-52	elena22@example.net	52
165	Лыткин Варлаам Ефимович	+7 416 260 9296	evse77@example.net	52
166	Беспалова Анна Феликсовна	+7 (229) 417-39-88	sitnikovapollon@example.com	52
167	Варфоломей Ефремович Белозеров	+7 (836) 600-69-69	kirill1989@example.org	52
168	Феврония Аскольдовна Савина	+7 627 434 6218	gerasimdanilov@example.org	53
169	Сидорова Елизавета Архиповна	+7 (359) 243-85-27	lukjan81@example.org	53
170	Шашкова Надежда Афанасьевна	8 (372) 381-6157	ferapont_1985@example.net	53
171	Ирина Львовна Турова	8 (655) 698-1200	nazarovsofron@example.org	53
172	Гусев Эмиль Дорофеевич	+7 (222) 910-3033	shchukinmark@example.org	53
173	г-жа Мельникова Варвара Михайловна	+7 (487) 913-6742	foma_60@example.com	54
174	Трофим Адамович Егоров	+7 954 392 5274	tsvetkovapolina@example.org	54
175	Наум Изотович Гаврилов	8 506 747 9128	demid_59@example.net	54
176	Жуков Якуб Ефимьевич	+72172830985	vlasvinogradov@example.org	54
177	Прасковья Макаровна Капустина	+76495104219	agafja69@example.com	54
178	Кабанова Юлия Васильевна	+7 (990) 976-88-95	gbobilev@example.org	55
179	Белоусов Федор Дмитриевич	8 894 635 36 03	prohorovnikifor@example.net	55
180	Марфа Матвеевна Крюкова	+7 (006) 103-9773	kuprijanshirjaev@example.net	55
181	Серафим Еремеевич Борисов	8 411 640 28 49	nonna1976@example.com	55
182	Елизавета Святославовна Васильева	86554609155	denisovvladlen@example.org	55
57	Андрон Адрианович Дроздов	8 (583) 794-67-40	kalininsaveli@example.com	36
58	Сафонова Ольга Яковлевна	8 (543) 912-7190	ljubosmisl_1980@example.com	36
59	Анисимов Евлампий Федосьевич	+7 (056) 170-17-23	tihonovaevgenija@example.org	36
60	Харитонова Фёкла Валентиновна	8 453 836 9122	zinaida_1984@example.net	36
61	Кулаков Кондратий Тарасович	8 504 428 8870	denis2000@example.org	36
62	Борисов Варфоломей Августович	8 820 799 9241	trifon1978@example.org	37
63	Александра Архиповна Галкина	+74623339586	elizaveta05@example.net	37
64	Потапова Евфросиния Николаевна	+75818119291	vseslavloginov@example.com	37
65	Панфилов Корнил Марсович	8 964 890 8914	anatoli48@example.net	37
66	Раиса Вячеславовна Рогова	+7 (648) 869-9255	zsharov@example.net	37
68	Маргарита Тимофеевна Фомичева	8 674 025 27 65	avdeantonov@example.net	38
72	Марфа Аркадьевна Антонова	8 (267) 536-8635	merkushevsevastjan@example.org	39
73	Елизавета Матвеевна Кондратьева	8 372 780 1478	dobroslav_2005@example.org	39
74	Василиса Ивановна Зимина	+7 (038) 441-1743	jakovlevpetr@example.com	39
75	Аполлинарий Якубович Елисеев	8 894 920 54 33	fade_2010@example.net	39
76	Олимпиада Рубеновна Маслова	+74501282563	egorovfade@example.net	39
77	Ия Олеговна Ширяева	+7 (245) 894-19-27	lavr30@example.net	40
78	Коновалова Вероника Эльдаровна	+7 422 649 19 34	rogovratibor@example.org	40
79	Прасковья Степановна Ситникова	8 143 695 6335	mefodi70@example.org	40
80	Ларионова Лариса Юльевна	8 023 082 4625	aksenovratibor@example.org	40
81	Никонова Анастасия Олеговна	8 (835) 822-4195	agata12@example.org	40
84	Миронов Любомир Фролович	8 007 492 44 94	sofon2015@example.org	41
86	Калинин Валерий Давидович	8 571 508 6588	agap_1974@example.com	41
87	Денисов Творимир Зиновьевич	+7 (518) 438-9093	jakovlevamvrosi@example.net	42
88	Ян Гертрудович Самсонов	8 (562) 989-08-48	sitnikovladislav@example.com	42
89	Прохоров Фирс Ануфриевич	8 (345) 925-8126	smirnovplaton@example.com	42
90	Воронов Андрон Демьянович	8 714 607 2729	kononovfoka@example.com	42
91	Белов Илья Даниилович	8 (803) 283-1833	fekla77@example.com	42
99	Фёкла Яковлевна Костина	+7 (697) 400-2493	andron40@example.com	44
102	Евдокимов Федор Анатольевич	8 (805) 699-2442	emeljan_74@example.com	45
103	Лаврентий Эдуардович Воробьев	+7 (271) 394-26-12	denis_76@example.net	45
104	Моисеев Николай Арсенович	+7 902 504 6259	polina98@example.net	45
105	Ангелина Рудольфовна Гуляева	+7 (159) 578-0869	mishinaregina@example.com	45
106	Антонин Виленович Смирнов	+7 446 660 49 22	dgromova@example.net	45
98	Оксана Григорьевна Лихачева	8 (375) 557-5011	dorofeevsaveli@example.com	44
119	9999	123121	213@	38
112	фывыфв	фы	213@	38
121	qwerty	фы	213@	38
123	qwerty	213	123@asd	41
82	Жанна Геннадиевна Быкова	+7 756 781 9444	rkulakova@example.org	41
\.


--
-- TOC entry 3460 (class 0 OID 16401)
-- Dependencies: 221
-- Data for Name: document_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.document_requests (id, date, tender_id) FROM stdin;
764	2025-01-05	2
765	2025-01-04	2
766	2025-01-03	2
767	2025-01-03	3
768	2025-01-05	3
769	2025-01-06	3
770	2025-01-05	4
771	2025-01-06	4
772	2025-01-03	5
773	2025-01-06	5
774	2025-01-04	6
775	2025-01-01	6
776	2025-01-01	6
777	2025-01-01	7
778	2025-01-06	7
779	2025-01-03	8
780	2025-01-05	8
781	2025-01-03	9
782	2025-01-01	9
783	2025-01-05	10
784	2025-01-02	10
785	2025-01-06	10
786	2025-01-05	11
787	2025-01-05	11
788	2025-01-02	11
789	2025-01-06	12
790	2025-01-02	12
791	2025-01-04	13
792	2025-01-06	13
793	2025-01-01	13
794	2025-01-06	14
795	2025-01-02	14
796	2025-01-01	14
797	2025-01-02	15
798	2025-01-01	15
799	2025-01-01	16
800	2025-01-06	16
801	2025-01-01	17
802	2025-01-04	17
803	2025-01-01	18
804	2025-01-05	18
805	2025-01-01	18
806	2025-01-04	19
807	2025-01-04	19
808	2025-01-04	20
809	2025-01-06	20
810	2025-01-04	21
811	2025-01-06	21
812	2025-01-02	22
813	2025-01-05	22
814	2025-01-05	22
815	2025-01-01	23
816	2025-01-05	23
817	2025-01-04	23
818	2025-01-01	24
819	2025-01-01	24
820	2025-01-01	25
821	2025-01-05	25
822	2025-01-01	25
823	2025-01-04	26
824	2025-01-05	26
\.


--
-- TOC entry 3462 (class 0 OID 16406)
-- Dependencies: 223
-- Data for Name: document_requests_files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.document_requests_files (id, name, document_request_id) FROM stdin;
\.


--
-- TOC entry 3464 (class 0 OID 16412)
-- Dependencies: 225
-- Data for Name: rebidding_prices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rebidding_prices (tender_id, price, id) FROM stdin;
2	40850.79	669
2	12137.58	670
2	69398.55	671
3	65308.38	672
3	6428.56	673
3	69619.47	674
4	214766.95	675
4	244834.15	676
4	131584.06	677
5	25704.46	678
5	45651.86	679
6	37009.86	680
6	130957.26	681
7	54309.30	682
7	56176.09	683
8	96448.81	684
8	40679.27	685
10	32037.97	686
10	28491.79	687
11	66379.29	688
11	68976.79	689
11	35524.03	690
12	7079.14	691
12	51700.72	692
12	198217.49	693
13	1837.83	694
13	5634.79	695
13	2310.16	696
14	56524.37	697
14	82809.66	698
16	2601.16	699
16	2564.14	700
16	2359.31	701
17	9989.91	702
17	15106.14	703
18	27032.48	704
18	19652.90	705
18	27117.08	706
19	9625.71	707
19	5266.92	708
20	41102.18	709
20	59756.84	710
20	2008.89	711
23	80683.95	712
23	90869.46	713
23	62846.81	714
24	20869.06	715
24	30390.68	716
24	7812.47	717
\.


--
-- TOC entry 3465 (class 0 OID 16416)
-- Dependencies: 226
-- Data for Name: rebidding_prices_files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rebidding_prices_files (id, name, rebidding_price_id) FROM stdin;
\.


--
-- TOC entry 3470 (class 0 OID 16430)
-- Dependencies: 231
-- Data for Name: tenders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tenders (id, status, name, lot_number, register_number, initial_max_price, price, contact_person, phone_number, email, date1_start, date1_finish, date2_finish, comment1, comment2, comment3, comment4, comment5, comment0, contract_number, contract_date, company_id, is_special, date_finish, contact_person_id) FROM stdin;
2	6	Адаптация динамичных интернет-услуг тендер	Лот 3953803026	Реестр 0455204815	257193.47	95270.95	ФИО	+7 560 830 2510	vorobevvladimir@example.org	2025-01-03 02:05:29	2025-01-16 02:05:29	2025-01-04 02:05:29	\N	\N	\N	\N	\N	\N	Контракт 204	2025-01-04	49	f	2025-01-23 02:05:29	150
3	4	Максимизация соблазнительных технологий лот	Лот 8137737785	Реестр 1276564196	336825.72	96000.31	ФИО	+7 381 168 47 97	prokofipanov@example.com	2025-01-01 19:36:08	2025-01-10 19:36:08	2025-01-03 19:36:08	\N	\N	\N	\N	\N	\N	\N	\N	52	f	2025-01-19 19:36:08	164
4	3	Разработка современных действий тендер	Лот 5049995680	Реестр 0527654821	340420.53	263422.29	ФИО	8 860 821 31 84	adam_89@example.org	2025-01-03 05:03:50	2025-02-02 05:03:50	2025-01-11 05:03:50	\N	\N	\N	\N	\N	\N	\N	\N	49	f	2025-01-03 05:03:50	148
5	6	Оцифровка прозрачных отношений тендер	Лот 7540928489	Реестр 6238792657	397644.11	74874.54	ФИО	+7 (531) 973-09-24	birjukovamarfa@example.org	2025-01-01 15:09:48	2025-01-23 15:09:48	2025-01-19 15:09:48	\N	\N	\N	\N	\N	\N	Контракт 387	2025-01-06	38	f	2025-01-25 15:09:48	119
6	5	Оптимизация притягательных архитектур лот	Лот 1975780847	Реестр 9802425894	220281.13	175909.00	ФИО	8 149 238 65 71	borislav_1971@example.org	2025-01-04 07:37:23	2025-01-08 07:37:23	2025-01-08 07:37:23	\N	\N	\N	\N	\N	\N	Контракт 344	2025-01-01	49	f	2025-01-27 07:37:23	149
7	5	Производство притягательных интернет-компаний лот	Лот 3457032709	Реестр 4505284987	464282.83	58434.14	ФИО	8 (724) 920-4872	aleksandrkudrjavtsev@example.net	2025-01-04 18:31:57	2025-01-27 18:31:57	2025-01-12 18:31:57	\N	\N	\N	\N	\N	\N	Контракт 444	2025-01-01	37	f	2025-01-08 18:31:57	65
8	4	Развитие онлайн и офлайн приложений лот	Лот 8921961401	Реестр 1769496867	140181.88	111773.69	ФИО	8 (502) 721-91-36	miheevgerasim@example.com	2025-01-04 02:32:03	2025-01-28 02:32:03	2025-02-01 02:32:03	\N	\N	\N	\N	\N	\N	\N	\N	53	f	2025-01-19 02:32:03	172
9	1	Управление инновационных инфраструктур тендер	Лот 9309493248	Реестр 5755447293	422811.34	77040.66	ФИО	+7 (441) 399-5782	litkinsamuil@example.com	2025-01-02 12:37:47	2025-01-02 12:37:47	2025-01-02 12:37:47	\N	\N	\N	\N	\N	\N	\N	\N	39	f	2025-01-02 12:37:47	73
10	4	Включение лучших в своём роде инициатив лот	Лот 0952183845	Реестр 2622516491	38023.42	33461.24	ФИО	+7 815 895 4933	artemi39@example.com	2025-01-02 06:00:01	2025-01-31 06:00:01	2025-01-22 06:00:01	\N	\N	\N	\N	\N	\N	\N	\N	37	f	2025-01-22 06:00:01	62
11	6	Интеграция корпоративных интернет-магазинов лот	Лот 0129731550	Реестр 5555282653	474650.02	105641.55	ФИО	8 (689) 816-25-81	avtonom_41@example.org	2025-01-06 09:41:18	2025-01-16 09:41:18	2025-01-18 09:41:18	\N	\N	\N	\N	\N	\N	Контракт 890	2025-01-01	41	f	2025-01-28 09:41:18	86
12	5	Развитие интегрированных интерфейсов тендер	Лот 1462704187	Реестр 1839618575	367961.57	251229.17	ФИО	+7 213 561 8905	fekla1989@example.net	2025-01-04 21:04:48	2025-01-28 21:04:48	2025-01-29 21:04:48	\N	\N	\N	\N	\N	\N	Контракт 184	2025-01-02	37	f	2025-01-11 21:04:48	65
13	3	Внедрение наглядных областей интереса лот	Лот 2961096177	Реестр 3153336106	137869.17	7470.38	ФИО	8 618 089 46 81	uvarovnikandr@example.net	2025-01-04 21:12:43	2025-01-05 21:12:43	2025-01-15 21:12:43	\N	\N	\N	\N	\N	\N	\N	\N	37	f	2025-01-04 21:12:43	64
14	6	Оцифровка прибыльных взаимодействий тендер	Лот 0124792437	Реестр 9797256133	298488.78	88501.36	ФИО	89675706530	panfilovaninel@example.net	2025-01-04 15:39:55	2025-01-28 15:39:55	2025-01-27 15:39:55	\N	\N	\N	\N	\N	\N	Контракт 262	2025-01-01	51	f	2025-01-25 15:39:55	159
15	2	Модернизация расширяемых результатов лот	Лот 0317261311	Реестр 4237730273	237049.35	47367.20	ФИО	8 916 376 10 17	zaharovantip@example.org	2025-01-02 20:04:41	2025-01-28 20:04:41	2025-01-02 20:04:41	\N	\N	\N	\N	\N	\N	\N	\N	41	f	2025-01-02 20:04:41	84
16	5	Инновация соблазнительных каналов тендер	Лот 7812154476	Реестр 6549628749	18938.18	4412.52	ФИО	8 961 011 0339	dmitrievlazar@example.org	2025-01-06 17:58:05	2025-01-21 17:58:05	2025-01-22 17:58:05	\N	\N	\N	\N	\N	\N	Контракт 031	2025-01-05	51	f	2025-01-24 17:58:05	159
17	3	Трансформация интегрированных интернет-компаний лот	Лот 9665580850	Реестр 9997807223	398454.62	98849.50	ФИО	+7 184 064 49 28	litkinruslan@example.net	2025-01-03 21:35:32	2025-02-01 21:35:32	2025-02-01 21:35:32	\N	\N	\N	\N	\N	\N	\N	\N	48	f	2025-01-03 21:35:32	144
18	4	Включение соблазнительных действий лот	Лот 0394688148	Реестр 4969384910	454245.44	29940.48	ФИО	+7 (788) 743-41-68	velimirkornilov@example.org	2025-01-06 12:03:51	2025-01-20 12:03:51	2025-01-21 12:03:51	\N	\N	\N	\N	\N	\N	\N	\N	55	f	2025-01-09 12:03:51	179
19	3	Перепрофилирование целостных порталов лот	Лот 1372829853	Реестр 9759315688	12676.50	11703.98	ФИО	8 (012) 974-4674	zikovaraisa@example.net	2025-01-01 22:28:13	2025-01-04 22:28:13	2025-01-08 22:28:13	\N	\N	\N	\N	\N	\N	\N	\N	40	f	2025-01-01 22:28:13	81
20	4	Обеспечение корпоративных инфраструктур лот	Лот 7324277977	Реестр 4314227861	319507.26	107524.87	ФИО	8 300 488 6137	frol1985@example.org	2025-01-01 13:26:50	2025-01-20 13:26:50	2025-01-30 13:26:50	\N	\N	\N	\N	\N	\N	\N	\N	51	f	2025-01-03 13:26:50	162
21	1	Максимизация интерактивных интернет-магазинов лот	Лот 8000287580	Реестр 8520763327	311300.72	228415.41	ФИО	+7 (375) 514-83-50	arefimaslov@example.net	2025-01-06 03:38:13	2025-01-06 03:38:13	2025-01-06 03:38:13	\N	\N	\N	\N	\N	\N	\N	\N	52	f	2025-01-06 03:38:13	165
22	2	Распределение корпоративных инициатив лот	Лот 2718154868	Реестр 6633469740	57178.11	47499.77	ФИО	+71091007295	osipovaolimpiada@example.org	2025-01-06 05:19:57	2025-01-19 05:19:57	2025-01-06 05:19:57	\N	\N	\N	\N	\N	\N	\N	\N	45	f	2025-01-06 05:19:57	105
23	4	Переосмысление виртуальных технологий лот	Лот 6699158250	Реестр 8067495942	211644.26	123654.83	ФИО	8 464 357 28 38	viktor_49@example.com	2025-01-05 15:50:11	2025-01-26 15:50:11	2025-01-22 15:50:11	\N	\N	\N	\N	\N	\N	\N	\N	38	f	2025-01-13 15:50:11	120
24	5	Распределение масштабируемых инициатив лот	Лот 3547185683	Реестр 8233270407	78249.80	38656.79	ФИО	8 (905) 413-8032	braginisidor@example.com	2025-01-02 20:30:10	2025-01-21 20:30:10	2025-01-25 20:30:10	\N	\N	\N	\N	\N	\N	Контракт 329	2025-01-05	55	f	2025-01-04 20:30:10	180
25	1	Управление концептуальных областей интереса лот	Лот 1933571350	Реестр 5696566482	387142.45	101159.17	ФИО	+7 (642) 650-5694	irakli1988@example.com	2025-01-06 12:36:03	2025-01-06 12:36:03	2025-01-06 12:36:03	\N	\N	\N	\N	\N	\N	\N	\N	54	f	2025-01-06 12:36:03	174
26	1	Приспособление критически важных интернет-продавцов тендер	Лот 4784375499	Реестр 4770280107	384700.38	202352.93	ФИО	+7 429 893 2584	bogdan_30@example.org	2025-01-01 12:32:12	2025-01-01 12:32:12	2025-01-01 12:32:12	\N	\N	\N	\N	\N	\N	\N	\N	42	f	2025-01-01 12:32:12	88
\.


--
-- TOC entry 3468 (class 0 OID 16423)
-- Dependencies: 229
-- Data for Name: tenders_files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tenders_files (id, name, stage, tender_id) FROM stdin;
\.


--
-- TOC entry 3472 (class 0 OID 16450)
-- Dependencies: 233
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, password, salt, role) FROM stdin;
5	12345678	7f820fc07428cb5a163b5b0ab240105a60255f315b7c67d0531043f906699f1b4704f453795f448f41e344bf2df16459d3474bc7ad5ee51da44fb71f8497bcdc	83fc6118709cf9930f35e03692310a24	viewer
1	123	2adae0915d90256a9b351bbb1fc424c8051dbc9e50aa0142795cf7c6313679c9fa9e5d2084dc15df1178b8e8ae609d1da4828e9e2ae39a45bcd6e7baf7d865a7	4bbc21b5c220a97d64eedb2d5d2d1845	editor
3	admin	a4c7ff39e5c5d3c6689678a7bcee31fc5f600b8fc56b8aa589ae8bfdf3b25878ea0756ddbbec49ce7074a6fd890694e5a01ff00ba3b6598b6fc008d9b436f851	cd7231205416841d9c012f17208c8816	admin
\.


--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 218
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.companies_id_seq', 55, true);


--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 220
-- Name: contact_persons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_persons_id_seq', 182, true);


--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 222
-- Name: date_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.date_requests_id_seq', 824, true);


--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 224
-- Name: document_requests_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.document_requests_files_id_seq', 72, true);


--
-- TOC entry 3487 (class 0 OID 0)
-- Dependencies: 227
-- Name: rebidding_prices_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rebidding_prices_files_id_seq', 15, true);


--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 228
-- Name: request_prices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.request_prices_id_seq', 717, true);


--
-- TOC entry 3489 (class 0 OID 0)
-- Dependencies: 230
-- Name: tender_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tender_files_id_seq', 77, true);


--
-- TOC entry 3490 (class 0 OID 0)
-- Dependencies: 232
-- Name: tenders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tenders_id_seq', 26, true);


--
-- TOC entry 3491 (class 0 OID 0)
-- Dependencies: 234
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- TOC entry 3278 (class 2606 OID 16459)
-- Name: companies companies_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_name_key UNIQUE (name);


--
-- TOC entry 3280 (class 2606 OID 16461)
-- Name: companies companies_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pk PRIMARY KEY (id);


--
-- TOC entry 3282 (class 2606 OID 16463)
-- Name: contact_persons contact_persons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_persons
    ADD CONSTRAINT contact_persons_pkey PRIMARY KEY (id);


--
-- TOC entry 3286 (class 2606 OID 16465)
-- Name: document_requests_files document_requests_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_requests_files
    ADD CONSTRAINT document_requests_files_pkey PRIMARY KEY (id);


--
-- TOC entry 3288 (class 2606 OID 16467)
-- Name: rebidding_prices prices_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rebidding_prices
    ADD CONSTRAINT prices_pk PRIMARY KEY (id);


--
-- TOC entry 3290 (class 2606 OID 16469)
-- Name: rebidding_prices_files rebidding_prices_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rebidding_prices_files
    ADD CONSTRAINT rebidding_prices_files_pkey PRIMARY KEY (id);


--
-- TOC entry 3284 (class 2606 OID 16471)
-- Name: document_requests requests_dates_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_requests
    ADD CONSTRAINT requests_dates_pk PRIMARY KEY (id);


--
-- TOC entry 3292 (class 2606 OID 16473)
-- Name: tenders_files tender_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders_files
    ADD CONSTRAINT tender_files_pkey PRIMARY KEY (id);


--
-- TOC entry 3294 (class 2606 OID 16475)
-- Name: tenders tenders_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders
    ADD CONSTRAINT tenders_pk PRIMARY KEY (id);


--
-- TOC entry 3296 (class 2606 OID 16477)
-- Name: tenders tenders_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders
    ADD CONSTRAINT tenders_unique UNIQUE (register_number);


--
-- TOC entry 3298 (class 2606 OID 16479)
-- Name: tenders tenders_unique_1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders
    ADD CONSTRAINT tenders_unique_1 UNIQUE (lot_number);


--
-- TOC entry 3300 (class 2606 OID 16481)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3302 (class 2606 OID 16483)
-- Name: users users_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_unique UNIQUE (name);


--
-- TOC entry 3303 (class 2606 OID 16484)
-- Name: contact_persons contact_persons_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_persons
    ADD CONSTRAINT contact_persons_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- TOC entry 3305 (class 2606 OID 16489)
-- Name: document_requests_files document_requests_files_document_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_requests_files
    ADD CONSTRAINT document_requests_files_document_request_id_fkey FOREIGN KEY (document_request_id) REFERENCES public.document_requests(id);


--
-- TOC entry 3306 (class 2606 OID 16494)
-- Name: rebidding_prices prices_tenders_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rebidding_prices
    ADD CONSTRAINT prices_tenders_fk FOREIGN KEY (tender_id) REFERENCES public.tenders(id);


--
-- TOC entry 3307 (class 2606 OID 16499)
-- Name: rebidding_prices_files rebidding_prices_files_rebidding_prices_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rebidding_prices_files
    ADD CONSTRAINT rebidding_prices_files_rebidding_prices_id_fkey FOREIGN KEY (rebidding_price_id) REFERENCES public.rebidding_prices(id);


--
-- TOC entry 3304 (class 2606 OID 16504)
-- Name: document_requests requests_dates_tenders_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_requests
    ADD CONSTRAINT requests_dates_tenders_fk FOREIGN KEY (tender_id) REFERENCES public.tenders(id);


--
-- TOC entry 3308 (class 2606 OID 16509)
-- Name: tenders_files tender_files_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders_files
    ADD CONSTRAINT tender_files_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.tenders(id);


--
-- TOC entry 3309 (class 2606 OID 16514)
-- Name: tenders tenders_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders
    ADD CONSTRAINT tenders_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- TOC entry 3310 (class 2606 OID 16519)
-- Name: tenders tenders_contact_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders
    ADD CONSTRAINT tenders_contact_person_id_fkey FOREIGN KEY (contact_person_id) REFERENCES public.contact_persons(id);


-- Completed on 2025-01-27 17:56:12

--
-- PostgreSQL database dump complete
--

