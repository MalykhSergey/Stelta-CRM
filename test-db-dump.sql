--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17rc1

-- Started on 2025-02-26 16:37:26

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
-- TOC entry 3486 (class 1262 OID 16384)
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

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 866 (class 1247 OID 16386)
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'editor',
    'viewer'
);


--
-- TOC entry 237 (class 1255 OID 16393)
-- Name: log_status_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_status_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
         INSERT INTO public.tender_status_history (tender_id, status, changed_at)
         VALUES (NEW.id, NEW.status, now());
    ELSIF TG_OP = 'UPDATE' THEN
         IF NEW.status <> OLD.status THEN
             INSERT INTO public.tender_status_history (tender_id, status, changed_at)
             VALUES (NEW.id, NEW.status, now());
         END IF;
    END IF;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16394)
-- Name: companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying
);


--
-- TOC entry 218 (class 1259 OID 16399)
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
-- TOC entry 219 (class 1259 OID 16400)
-- Name: contact_persons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_persons (
    id integer NOT NULL,
    name character varying(255) DEFAULT 'Не указан'::character varying NOT NULL,
    phone_number character varying(50) DEFAULT 'Не указан'::character varying NOT NULL,
    email character varying(255) DEFAULT 'Не указан'::character varying NOT NULL,
    company_id integer NOT NULL,
    CONSTRAINT contact_persons_email_check CHECK (((email)::text ~~ '%@%'::text))
);


--
-- TOC entry 220 (class 1259 OID 16409)
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
-- TOC entry 221 (class 1259 OID 16410)
-- Name: document_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_requests (
    id integer NOT NULL,
    date date DEFAULT now() NOT NULL,
    tender_id integer NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 16414)
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
-- TOC entry 3495 (class 0 OID 0)
-- Dependencies: 222
-- Name: date_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.date_requests_id_seq OWNED BY public.document_requests.id;


--
-- TOC entry 223 (class 1259 OID 16415)
-- Name: document_requests_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_requests_files (
    id integer NOT NULL,
    name character varying NOT NULL,
    document_request_id integer NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 16420)
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
-- TOC entry 225 (class 1259 OID 16421)
-- Name: rebidding_prices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rebidding_prices (
    tender_id integer NOT NULL,
    price numeric(16,2) DEFAULT 0 NOT NULL,
    id integer NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 16425)
-- Name: rebidding_prices_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rebidding_prices_files (
    id integer NOT NULL,
    name character varying NOT NULL,
    rebidding_price_id integer NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 16430)
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
-- TOC entry 228 (class 1259 OID 16431)
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
-- TOC entry 3496 (class 0 OID 0)
-- Dependencies: 228
-- Name: request_prices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.request_prices_id_seq OWNED BY public.rebidding_prices.id;


--
-- TOC entry 229 (class 1259 OID 16432)
-- Name: tenders_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenders_files (
    id integer NOT NULL,
    name character varying NOT NULL,
    stage smallint DEFAULT 0 NOT NULL,
    tender_id integer NOT NULL
);


--
-- TOC entry 230 (class 1259 OID 16438)
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
-- TOC entry 231 (class 1259 OID 16439)
-- Name: tender_status_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tender_status_history (
    tender_id integer NOT NULL,
    status smallint NOT NULL,
    changed_at timestamp without time zone NOT NULL
);


--
-- TOC entry 236 (class 1259 OID 16543)
-- Name: tender_status_cache; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.tender_status_cache AS
 WITH min_max_dates AS (
         SELECT min((tender_status_history.changed_at)::date) AS min_date,
            max((tender_status_history.changed_at)::date) AS max_date
           FROM public.tender_status_history
        ), date_series AS (
         SELECT (generate_series((min_max_dates.min_date)::timestamp with time zone, (min_max_dates.max_date)::timestamp with time zone, '1 day'::interval))::date AS report_date
           FROM min_max_dates
        ), all_statuses AS (
         SELECT s.status
           FROM ( VALUES (0), (1), (2), (3), (4), (5), (6)) s(status)
        ), all_combinations AS (
         SELECT t.report_date,
            s.status
           FROM (date_series t
             CROSS JOIN all_statuses s)
        ), tender_status AS (
         SELECT c.report_date,
            c.status,
            (count(DISTINCT h.tender_id))::integer AS count_tenders
           FROM (all_combinations c
             LEFT JOIN LATERAL ( SELECT tender_status_history.tender_id,
                    first_value(tender_status_history.status) OVER (PARTITION BY tender_status_history.tender_id ORDER BY tender_status_history.changed_at DESC) AS status
                   FROM public.tender_status_history
                  WHERE ((tender_status_history.changed_at)::date <= c.report_date)) h ON ((h.status = c.status)))
          GROUP BY c.report_date, c.status
        )
 SELECT report_date AS date,
    status,
    count_tenders,
    (sum(count_tenders) OVER (PARTITION BY report_date ORDER BY status DESC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW))::integer AS cumulative_tenders
   FROM tender_status
  ORDER BY report_date, status
  WITH NO DATA;


--
-- TOC entry 232 (class 1259 OID 16442)
-- Name: tenders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenders (
    id integer NOT NULL,
    status smallint DEFAULT 0 NOT NULL,
    name character varying DEFAULT 'Полное наименование тендера'::character varying NOT NULL,
    short_name character varying DEFAULT 'Сокращённое наименование'::character varying NOT NULL,
    lot_number character varying DEFAULT 'Лот №'::character varying NOT NULL,
    register_number character varying DEFAULT 'Реестровый №'::character varying NOT NULL,
    initial_max_price numeric(16,2) DEFAULT 0 NOT NULL,
    price numeric(16,2) DEFAULT 0 NOT NULL,
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
-- TOC entry 233 (class 1259 OID 16458)
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
-- TOC entry 234 (class 1259 OID 16459)
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
-- TOC entry 235 (class 1259 OID 16465)
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
-- TOC entry 3265 (class 2604 OID 16466)
-- Name: document_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_requests ALTER COLUMN id SET DEFAULT nextval('public.date_requests_id_seq'::regclass);


--
-- TOC entry 3268 (class 2604 OID 16467)
-- Name: rebidding_prices id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rebidding_prices ALTER COLUMN id SET DEFAULT nextval('public.request_prices_id_seq'::regclass);


--
-- TOC entry 3469 (class 0 OID 16394)
-- Dependencies: 217
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (46, 'Соболева Лтд');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (47, 'Елисеева Лимитед');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (48, 'ООО «Герасимов-Зимин»');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (49, 'РАО «Мартынова-Некрасов»');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (50, 'ООО «Маслов, Воронцова и Матвеев»');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (51, 'АО «Блохина Нестеров»');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (52, 'АО «Котов-Калашников»');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (53, 'РАО «Зыков-Зыкова»');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (54, 'Аксенова и партнеры');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (55, 'ОАО «Поляков-Лазарева»');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (40, 'ООО «Михайлова Мишина»');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (36, 'Уральский банк реконструкции и развития');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (37, 'Попов Лтд');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (38, 'ООО «Козлов»');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (39, 'ООО «Игнатова, Кондратьев и Давыдов»');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (41, 'НПО «Калашников»');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (42, 'Фомина Инк');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (44, 'ОАО «Герасимов, Сергеев и Исаков»');
INSERT INTO public.companies OVERRIDING SYSTEM VALUE VALUES (45, 'ООО «Харитонов-Прохоров»');


--
-- TOC entry 3471 (class 0 OID 16400)
-- Dependencies: 219
-- Data for Name: contact_persons; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (120, '777777', '123121', '213@', 38);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (122, 'wasd', 'фы', '213@', 38);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (133, 'Исаков Фома Федотович', '8 (922) 738-3373', 'tamara_2000@example.org', 46);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (134, 'Зайцева Нинель Борисовна', '+7 (487) 400-8731', 'natan_2003@example.com', 46);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (135, 'Евгений Феофанович Марков', '+7 (153) 539-7219', 'loginovpavel@example.org', 46);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (136, 'Лидия Андреевна Русакова', '+7 804 676 82 05', 'boleslav64@example.com', 46);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (137, 'Денисов Савелий Брониславович', '8 (206) 958-77-45', 'gerasim_2000@example.net', 46);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (138, 'Комаров Тит Зиновьевич', '+73832138466', 'amos_32@example.org', 47);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (139, 'Наина Сергеевна Титова', '8 151 715 00 19', 'ikrjukova@example.com', 47);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (140, 'Казакова Василиса Юрьевна', '+7 (053) 513-3677', 'dementevanikita@example.net', 47);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (141, 'Евсеева Синклитикия Викторовна', '+7 916 521 45 48', 'ernst55@example.org', 47);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (142, 'Татьяна Константиновна Воронова', '+78125484281', 'knjazevevlampi@example.net', 47);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (143, 'Феофан Юлианович Комаров', '+7 (368) 687-40-66', 'samsonovlavrenti@example.org', 48);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (144, 'Фадей Бенедиктович Кудрявцев', '+7 (131) 795-77-64', 'ustinovafaina@example.com', 48);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (145, 'Тетерина Кира Харитоновна', '+7 441 291 72 99', 'sigizmundgusev@example.org', 48);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (146, 'Матвей Феоктистович Панфилов', '8 (457) 054-0632', 'artem1995@example.com', 48);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (147, 'Тимур Григорьевич Морозов', '+7 913 450 13 93', 'xfedoseev@example.com', 48);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (148, 'Аксенов Велимир Ярославович', '+77534964030', 'miroslav_07@example.net', 49);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (149, 'Попова Анжелика Мироновна', '8 430 729 98 76', 'izmail_63@example.net', 49);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (150, 'Самуил Ефстафьевич Рыбаков', '+7 (432) 170-19-76', 'sofija_1993@example.org', 49);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (151, 'Азарий Изотович Русаков', '+7 697 431 0877', 'anatolidoronin@example.net', 49);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (152, 'Акулина Натановна Меркушева', '8 (008) 187-48-13', 'kulakovplaton@example.net', 49);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (153, 'Ангелина Максимовна Родионова', '8 (591) 171-7247', 'averjan_30@example.net', 50);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (154, 'Спиридон Аксёнович Рябов', '8 (832) 303-70-11', 'nikita1985@example.net', 50);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (155, 'Кира Станиславовна Лукина', '8 569 414 66 89', 'kuznetsovsevastjan@example.org', 50);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (156, 'Прасковья Захаровна Нестерова', '86978942432', 'radovan_1970@example.com', 50);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (157, 'Виноградова Евгения Ждановна', '80183204430', 'tretjakovmartjan@example.net', 50);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (158, 'Анжела Владиславовна Романова', '8 107 194 4734', 'smirnovnikanor@example.com', 51);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (159, 'Колобова Юлия Оскаровна', '8 (413) 456-89-06', 'evdokimmolchanov@example.org', 51);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (160, 'Константинова Лора Филипповна', '+7 (164) 063-6118', 'cnikolaeva@example.org', 51);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (161, 'Корнилова Милица Валентиновна', '+7 935 030 74 02', 'golubevgorde@example.com', 51);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (162, 'Фролов Агафон Арсеньевич', '8 788 343 0287', 'kudrjavtsevaolga@example.com', 51);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (163, 'Яков Вилорович Калашников', '+7 (453) 565-08-18', 'nikandr78@example.com', 52);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (164, 'Сергей Ярославович Зиновьев', '8 (612) 716-46-52', 'elena22@example.net', 52);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (165, 'Лыткин Варлаам Ефимович', '+7 416 260 9296', 'evse77@example.net', 52);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (166, 'Беспалова Анна Феликсовна', '+7 (229) 417-39-88', 'sitnikovapollon@example.com', 52);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (167, 'Варфоломей Ефремович Белозеров', '+7 (836) 600-69-69', 'kirill1989@example.org', 52);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (168, 'Феврония Аскольдовна Савина', '+7 627 434 6218', 'gerasimdanilov@example.org', 53);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (169, 'Сидорова Елизавета Архиповна', '+7 (359) 243-85-27', 'lukjan81@example.org', 53);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (170, 'Шашкова Надежда Афанасьевна', '8 (372) 381-6157', 'ferapont_1985@example.net', 53);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (171, 'Ирина Львовна Турова', '8 (655) 698-1200', 'nazarovsofron@example.org', 53);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (172, 'Гусев Эмиль Дорофеевич', '+7 (222) 910-3033', 'shchukinmark@example.org', 53);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (173, 'г-жа Мельникова Варвара Михайловна', '+7 (487) 913-6742', 'foma_60@example.com', 54);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (174, 'Трофим Адамович Егоров', '+7 954 392 5274', 'tsvetkovapolina@example.org', 54);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (175, 'Наум Изотович Гаврилов', '8 506 747 9128', 'demid_59@example.net', 54);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (176, 'Жуков Якуб Ефимьевич', '+72172830985', 'vlasvinogradov@example.org', 54);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (177, 'Прасковья Макаровна Капустина', '+76495104219', 'agafja69@example.com', 54);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (178, 'Кабанова Юлия Васильевна', '+7 (990) 976-88-95', 'gbobilev@example.org', 55);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (179, 'Белоусов Федор Дмитриевич', '8 894 635 36 03', 'prohorovnikifor@example.net', 55);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (180, 'Марфа Матвеевна Крюкова', '+7 (006) 103-9773', 'kuprijanshirjaev@example.net', 55);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (181, 'Серафим Еремеевич Борисов', '8 411 640 28 49', 'nonna1976@example.com', 55);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (182, 'Елизавета Святославовна Васильева', '86554609155', 'denisovvladlen@example.org', 55);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (57, 'Андрон Адрианович Дроздов', '8 (583) 794-67-40', 'kalininsaveli@example.com', 36);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (58, 'Сафонова Ольга Яковлевна', '8 (543) 912-7190', 'ljubosmisl_1980@example.com', 36);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (59, 'Анисимов Евлампий Федосьевич', '+7 (056) 170-17-23', 'tihonovaevgenija@example.org', 36);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (60, 'Харитонова Фёкла Валентиновна', '8 453 836 9122', 'zinaida_1984@example.net', 36);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (61, 'Кулаков Кондратий Тарасович', '8 504 428 8870', 'denis2000@example.org', 36);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (62, 'Борисов Варфоломей Августович', '8 820 799 9241', 'trifon1978@example.org', 37);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (63, 'Александра Архиповна Галкина', '+74623339586', 'elizaveta05@example.net', 37);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (64, 'Потапова Евфросиния Николаевна', '+75818119291', 'vseslavloginov@example.com', 37);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (65, 'Панфилов Корнил Марсович', '8 964 890 8914', 'anatoli48@example.net', 37);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (66, 'Раиса Вячеславовна Рогова', '+7 (648) 869-9255', 'zsharov@example.net', 37);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (68, 'Маргарита Тимофеевна Фомичева', '8 674 025 27 65', 'avdeantonov@example.net', 38);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (72, 'Марфа Аркадьевна Антонова', '8 (267) 536-8635', 'merkushevsevastjan@example.org', 39);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (73, 'Елизавета Матвеевна Кондратьева', '8 372 780 1478', 'dobroslav_2005@example.org', 39);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (74, 'Василиса Ивановна Зимина', '+7 (038) 441-1743', 'jakovlevpetr@example.com', 39);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (75, 'Аполлинарий Якубович Елисеев', '8 894 920 54 33', 'fade_2010@example.net', 39);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (76, 'Олимпиада Рубеновна Маслова', '+74501282563', 'egorovfade@example.net', 39);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (77, 'Ия Олеговна Ширяева', '+7 (245) 894-19-27', 'lavr30@example.net', 40);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (78, 'Коновалова Вероника Эльдаровна', '+7 422 649 19 34', 'rogovratibor@example.org', 40);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (79, 'Прасковья Степановна Ситникова', '8 143 695 6335', 'mefodi70@example.org', 40);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (80, 'Ларионова Лариса Юльевна', '8 023 082 4625', 'aksenovratibor@example.org', 40);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (81, 'Никонова Анастасия Олеговна', '8 (835) 822-4195', 'agata12@example.org', 40);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (84, 'Миронов Любомир Фролович', '8 007 492 44 94', 'sofon2015@example.org', 41);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (86, 'Калинин Валерий Давидович', '8 571 508 6588', 'agap_1974@example.com', 41);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (87, 'Денисов Творимир Зиновьевич', '+7 (518) 438-9093', 'jakovlevamvrosi@example.net', 42);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (88, 'Ян Гертрудович Самсонов', '8 (562) 989-08-48', 'sitnikovladislav@example.com', 42);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (89, 'Прохоров Фирс Ануфриевич', '8 (345) 925-8126', 'smirnovplaton@example.com', 42);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (90, 'Воронов Андрон Демьянович', '8 714 607 2729', 'kononovfoka@example.com', 42);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (91, 'Белов Илья Даниилович', '8 (803) 283-1833', 'fekla77@example.com', 42);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (99, 'Фёкла Яковлевна Костина', '+7 (697) 400-2493', 'andron40@example.com', 44);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (102, 'Евдокимов Федор Анатольевич', '8 (805) 699-2442', 'emeljan_74@example.com', 45);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (103, 'Лаврентий Эдуардович Воробьев', '+7 (271) 394-26-12', 'denis_76@example.net', 45);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (104, 'Моисеев Николай Арсенович', '+7 902 504 6259', 'polina98@example.net', 45);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (105, 'Ангелина Рудольфовна Гуляева', '+7 (159) 578-0869', 'mishinaregina@example.com', 45);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (106, 'Антонин Виленович Смирнов', '+7 446 660 49 22', 'dgromova@example.net', 45);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (98, 'Оксана Григорьевна Лихачева', '8 (375) 557-5011', 'dorofeevsaveli@example.com', 44);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (119, '9999', '123121', '213@', 38);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (112, 'фывыфв', 'фы', '213@', 38);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (121, 'qwerty', 'фы', '213@', 38);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (123, 'qwerty', '213', '123@asd', 41);
INSERT INTO public.contact_persons OVERRIDING SYSTEM VALUE VALUES (82, 'Жанна Геннадиевна Быкова', '+7 756 781 9444', 'rkulakova@example.org', 41);


--
-- TOC entry 3473 (class 0 OID 16410)
-- Dependencies: 221
-- Data for Name: document_requests; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.document_requests VALUES (764, '2025-01-05', 2);
INSERT INTO public.document_requests VALUES (765, '2025-01-04', 2);
INSERT INTO public.document_requests VALUES (766, '2025-01-03', 2);
INSERT INTO public.document_requests VALUES (767, '2025-01-03', 3);
INSERT INTO public.document_requests VALUES (768, '2025-01-05', 3);
INSERT INTO public.document_requests VALUES (769, '2025-01-06', 3);
INSERT INTO public.document_requests VALUES (770, '2025-01-05', 4);
INSERT INTO public.document_requests VALUES (771, '2025-01-06', 4);
INSERT INTO public.document_requests VALUES (772, '2025-01-03', 5);
INSERT INTO public.document_requests VALUES (773, '2025-01-06', 5);
INSERT INTO public.document_requests VALUES (774, '2025-01-04', 6);
INSERT INTO public.document_requests VALUES (775, '2025-01-01', 6);
INSERT INTO public.document_requests VALUES (776, '2025-01-01', 6);
INSERT INTO public.document_requests VALUES (777, '2025-01-01', 7);
INSERT INTO public.document_requests VALUES (778, '2025-01-06', 7);
INSERT INTO public.document_requests VALUES (779, '2025-01-03', 8);
INSERT INTO public.document_requests VALUES (780, '2025-01-05', 8);
INSERT INTO public.document_requests VALUES (781, '2025-01-03', 9);
INSERT INTO public.document_requests VALUES (782, '2025-01-01', 9);
INSERT INTO public.document_requests VALUES (783, '2025-01-05', 10);
INSERT INTO public.document_requests VALUES (784, '2025-01-02', 10);
INSERT INTO public.document_requests VALUES (785, '2025-01-06', 10);
INSERT INTO public.document_requests VALUES (786, '2025-01-05', 11);
INSERT INTO public.document_requests VALUES (787, '2025-01-05', 11);
INSERT INTO public.document_requests VALUES (788, '2025-01-02', 11);
INSERT INTO public.document_requests VALUES (789, '2025-01-06', 12);
INSERT INTO public.document_requests VALUES (790, '2025-01-02', 12);
INSERT INTO public.document_requests VALUES (791, '2025-01-04', 13);
INSERT INTO public.document_requests VALUES (792, '2025-01-06', 13);
INSERT INTO public.document_requests VALUES (793, '2025-01-01', 13);
INSERT INTO public.document_requests VALUES (794, '2025-01-06', 14);
INSERT INTO public.document_requests VALUES (795, '2025-01-02', 14);
INSERT INTO public.document_requests VALUES (796, '2025-01-01', 14);
INSERT INTO public.document_requests VALUES (797, '2025-01-02', 15);
INSERT INTO public.document_requests VALUES (798, '2025-01-01', 15);
INSERT INTO public.document_requests VALUES (799, '2025-01-01', 16);
INSERT INTO public.document_requests VALUES (800, '2025-01-06', 16);
INSERT INTO public.document_requests VALUES (801, '2025-01-01', 17);
INSERT INTO public.document_requests VALUES (802, '2025-01-04', 17);
INSERT INTO public.document_requests VALUES (803, '2025-01-01', 18);
INSERT INTO public.document_requests VALUES (804, '2025-01-05', 18);
INSERT INTO public.document_requests VALUES (805, '2025-01-01', 18);
INSERT INTO public.document_requests VALUES (806, '2025-01-04', 19);
INSERT INTO public.document_requests VALUES (807, '2025-01-04', 19);
INSERT INTO public.document_requests VALUES (808, '2025-01-04', 20);
INSERT INTO public.document_requests VALUES (809, '2025-01-06', 20);
INSERT INTO public.document_requests VALUES (810, '2025-01-04', 21);
INSERT INTO public.document_requests VALUES (811, '2025-01-06', 21);
INSERT INTO public.document_requests VALUES (812, '2025-01-02', 22);
INSERT INTO public.document_requests VALUES (813, '2025-01-05', 22);
INSERT INTO public.document_requests VALUES (814, '2025-01-05', 22);
INSERT INTO public.document_requests VALUES (815, '2025-01-01', 23);
INSERT INTO public.document_requests VALUES (816, '2025-01-05', 23);
INSERT INTO public.document_requests VALUES (817, '2025-01-04', 23);
INSERT INTO public.document_requests VALUES (818, '2025-01-01', 24);
INSERT INTO public.document_requests VALUES (819, '2025-01-01', 24);
INSERT INTO public.document_requests VALUES (820, '2025-01-01', 25);
INSERT INTO public.document_requests VALUES (821, '2025-01-05', 25);
INSERT INTO public.document_requests VALUES (822, '2025-01-01', 25);
INSERT INTO public.document_requests VALUES (823, '2025-01-04', 26);
INSERT INTO public.document_requests VALUES (824, '2025-01-05', 26);


--
-- TOC entry 3475 (class 0 OID 16415)
-- Dependencies: 223
-- Data for Name: document_requests_files; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3477 (class 0 OID 16421)
-- Dependencies: 225
-- Data for Name: rebidding_prices; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.rebidding_prices VALUES (2, 40850.79, 669);
INSERT INTO public.rebidding_prices VALUES (2, 12137.58, 670);
INSERT INTO public.rebidding_prices VALUES (2, 69398.55, 671);
INSERT INTO public.rebidding_prices VALUES (3, 65308.38, 672);
INSERT INTO public.rebidding_prices VALUES (3, 6428.56, 673);
INSERT INTO public.rebidding_prices VALUES (3, 69619.47, 674);
INSERT INTO public.rebidding_prices VALUES (4, 214766.95, 675);
INSERT INTO public.rebidding_prices VALUES (4, 244834.15, 676);
INSERT INTO public.rebidding_prices VALUES (4, 131584.06, 677);
INSERT INTO public.rebidding_prices VALUES (5, 25704.46, 678);
INSERT INTO public.rebidding_prices VALUES (5, 45651.86, 679);
INSERT INTO public.rebidding_prices VALUES (6, 37009.86, 680);
INSERT INTO public.rebidding_prices VALUES (6, 130957.26, 681);
INSERT INTO public.rebidding_prices VALUES (7, 54309.30, 682);
INSERT INTO public.rebidding_prices VALUES (7, 56176.09, 683);
INSERT INTO public.rebidding_prices VALUES (8, 96448.81, 684);
INSERT INTO public.rebidding_prices VALUES (8, 40679.27, 685);
INSERT INTO public.rebidding_prices VALUES (10, 32037.97, 686);
INSERT INTO public.rebidding_prices VALUES (10, 28491.79, 687);
INSERT INTO public.rebidding_prices VALUES (11, 66379.29, 688);
INSERT INTO public.rebidding_prices VALUES (11, 68976.79, 689);
INSERT INTO public.rebidding_prices VALUES (11, 35524.03, 690);
INSERT INTO public.rebidding_prices VALUES (12, 7079.14, 691);
INSERT INTO public.rebidding_prices VALUES (12, 51700.72, 692);
INSERT INTO public.rebidding_prices VALUES (12, 198217.49, 693);
INSERT INTO public.rebidding_prices VALUES (13, 1837.83, 694);
INSERT INTO public.rebidding_prices VALUES (13, 5634.79, 695);
INSERT INTO public.rebidding_prices VALUES (13, 2310.16, 696);
INSERT INTO public.rebidding_prices VALUES (14, 56524.37, 697);
INSERT INTO public.rebidding_prices VALUES (14, 82809.66, 698);
INSERT INTO public.rebidding_prices VALUES (16, 2601.16, 699);
INSERT INTO public.rebidding_prices VALUES (16, 2564.14, 700);
INSERT INTO public.rebidding_prices VALUES (16, 2359.31, 701);
INSERT INTO public.rebidding_prices VALUES (17, 9989.91, 702);
INSERT INTO public.rebidding_prices VALUES (17, 15106.14, 703);
INSERT INTO public.rebidding_prices VALUES (18, 27032.48, 704);
INSERT INTO public.rebidding_prices VALUES (18, 19652.90, 705);
INSERT INTO public.rebidding_prices VALUES (18, 27117.08, 706);
INSERT INTO public.rebidding_prices VALUES (19, 9625.71, 707);
INSERT INTO public.rebidding_prices VALUES (19, 5266.92, 708);
INSERT INTO public.rebidding_prices VALUES (20, 41102.18, 709);
INSERT INTO public.rebidding_prices VALUES (20, 59756.84, 710);
INSERT INTO public.rebidding_prices VALUES (20, 2008.89, 711);
INSERT INTO public.rebidding_prices VALUES (23, 80683.95, 712);
INSERT INTO public.rebidding_prices VALUES (23, 90869.46, 713);
INSERT INTO public.rebidding_prices VALUES (23, 62846.81, 714);
INSERT INTO public.rebidding_prices VALUES (24, 20869.06, 715);
INSERT INTO public.rebidding_prices VALUES (24, 30390.68, 716);
INSERT INTO public.rebidding_prices VALUES (24, 7812.47, 717);


--
-- TOC entry 3478 (class 0 OID 16425)
-- Dependencies: 226
-- Data for Name: rebidding_prices_files; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3483 (class 0 OID 16439)
-- Dependencies: 231
-- Data for Name: tender_status_history; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tender_status_history VALUES (2, 0, '2025-03-02 09:09:07');
INSERT INTO public.tender_status_history VALUES (2, 2, '2025-07-23 00:47:08');
INSERT INTO public.tender_status_history VALUES (2, 6, '2025-09-15 08:35:15');
INSERT INTO public.tender_status_history VALUES (3, 0, '2025-07-17 07:37:46');
INSERT INTO public.tender_status_history VALUES (3, 5, '2025-09-21 09:30:55');
INSERT INTO public.tender_status_history VALUES (3, 4, '2025-11-13 11:15:34');
INSERT INTO public.tender_status_history VALUES (4, 0, '2025-05-17 18:34:37');
INSERT INTO public.tender_status_history VALUES (4, 5, '2025-07-25 17:58:18');
INSERT INTO public.tender_status_history VALUES (4, 3, '2025-11-09 23:31:28');
INSERT INTO public.tender_status_history VALUES (5, 0, '2025-05-27 18:31:17');
INSERT INTO public.tender_status_history VALUES (5, 5, '2025-07-19 22:35:34');
INSERT INTO public.tender_status_history VALUES (5, 6, '2025-10-28 04:22:45');
INSERT INTO public.tender_status_history VALUES (6, 0, '2025-04-18 12:13:55');
INSERT INTO public.tender_status_history VALUES (6, 3, '2025-08-25 07:18:16');
INSERT INTO public.tender_status_history VALUES (6, 5, '2025-12-26 16:56:30');
INSERT INTO public.tender_status_history VALUES (7, 0, '2025-02-28 07:24:24');
INSERT INTO public.tender_status_history VALUES (7, 2, '2025-10-08 19:05:28');
INSERT INTO public.tender_status_history VALUES (7, 5, '2025-11-28 16:16:22');
INSERT INTO public.tender_status_history VALUES (8, 0, '2025-01-10 09:30:12');
INSERT INTO public.tender_status_history VALUES (8, 6, '2025-12-11 00:00:35');
INSERT INTO public.tender_status_history VALUES (8, 4, '2025-12-29 22:47:07');
INSERT INTO public.tender_status_history VALUES (9, 0, '2025-05-06 07:07:30');
INSERT INTO public.tender_status_history VALUES (9, 5, '2025-05-27 05:09:35');
INSERT INTO public.tender_status_history VALUES (9, 1, '2025-08-14 08:28:00');
INSERT INTO public.tender_status_history VALUES (10, 0, '2025-05-23 13:48:49');
INSERT INTO public.tender_status_history VALUES (10, 1, '2025-07-13 02:15:23');
INSERT INTO public.tender_status_history VALUES (10, 4, '2025-10-18 21:00:30');
INSERT INTO public.tender_status_history VALUES (11, 0, '2025-02-18 17:34:27');
INSERT INTO public.tender_status_history VALUES (11, 1, '2025-06-05 19:41:33');
INSERT INTO public.tender_status_history VALUES (11, 6, '2025-10-13 16:38:11');
INSERT INTO public.tender_status_history VALUES (12, 0, '2025-06-14 09:52:21');
INSERT INTO public.tender_status_history VALUES (12, 2, '2025-10-17 06:21:14');
INSERT INTO public.tender_status_history VALUES (12, 5, '2025-10-26 21:12:02');
INSERT INTO public.tender_status_history VALUES (13, 0, '2025-03-05 18:35:08');
INSERT INTO public.tender_status_history VALUES (13, 5, '2025-04-09 03:49:08');
INSERT INTO public.tender_status_history VALUES (13, 3, '2025-12-25 21:04:13');
INSERT INTO public.tender_status_history VALUES (14, 0, '2025-04-21 09:58:05');
INSERT INTO public.tender_status_history VALUES (14, 5, '2025-05-02 01:05:32');
INSERT INTO public.tender_status_history VALUES (14, 6, '2025-08-23 21:35:23');
INSERT INTO public.tender_status_history VALUES (15, 0, '2025-03-01 12:26:21');
INSERT INTO public.tender_status_history VALUES (15, 5, '2025-03-05 02:09:04');
INSERT INTO public.tender_status_history VALUES (15, 2, '2025-03-07 22:22:21');
INSERT INTO public.tender_status_history VALUES (16, 0, '2025-04-06 22:05:17');
INSERT INTO public.tender_status_history VALUES (16, 3, '2025-11-27 08:35:26');
INSERT INTO public.tender_status_history VALUES (16, 5, '2025-11-29 18:24:08');
INSERT INTO public.tender_status_history VALUES (17, 0, '2025-01-09 08:25:40');
INSERT INTO public.tender_status_history VALUES (17, 5, '2025-01-22 12:15:29');
INSERT INTO public.tender_status_history VALUES (17, 3, '2025-08-01 17:42:21');
INSERT INTO public.tender_status_history VALUES (18, 0, '2025-03-06 08:56:11');
INSERT INTO public.tender_status_history VALUES (18, 1, '2025-10-16 10:33:29');
INSERT INTO public.tender_status_history VALUES (18, 4, '2025-12-25 22:40:25');
INSERT INTO public.tender_status_history VALUES (19, 0, '2025-05-01 08:23:41');
INSERT INTO public.tender_status_history VALUES (19, 2, '2025-07-28 08:33:39');
INSERT INTO public.tender_status_history VALUES (19, 3, '2025-12-18 09:23:49');
INSERT INTO public.tender_status_history VALUES (20, 0, '2025-01-04 14:31:35');
INSERT INTO public.tender_status_history VALUES (20, 2, '2025-03-22 07:42:35');
INSERT INTO public.tender_status_history VALUES (20, 4, '2025-08-12 04:44:42');
INSERT INTO public.tender_status_history VALUES (21, 0, '2025-01-31 23:14:35');
INSERT INTO public.tender_status_history VALUES (21, 5, '2025-08-10 09:57:45');
INSERT INTO public.tender_status_history VALUES (21, 1, '2025-10-22 03:30:03');
INSERT INTO public.tender_status_history VALUES (22, 0, '2025-01-05 04:04:53');
INSERT INTO public.tender_status_history VALUES (22, 1, '2025-06-18 12:36:18');
INSERT INTO public.tender_status_history VALUES (22, 2, '2025-09-04 11:08:43');
INSERT INTO public.tender_status_history VALUES (23, 0, '2025-01-04 04:17:13');
INSERT INTO public.tender_status_history VALUES (23, 6, '2025-05-11 05:16:24');
INSERT INTO public.tender_status_history VALUES (23, 4, '2025-10-05 00:42:01');
INSERT INTO public.tender_status_history VALUES (24, 0, '2025-03-12 17:37:03');
INSERT INTO public.tender_status_history VALUES (24, 6, '2025-06-04 18:19:40');
INSERT INTO public.tender_status_history VALUES (24, 5, '2025-06-15 08:10:56');
INSERT INTO public.tender_status_history VALUES (25, 0, '2025-02-28 22:18:45');
INSERT INTO public.tender_status_history VALUES (25, 5, '2025-06-12 02:26:44');
INSERT INTO public.tender_status_history VALUES (25, 1, '2025-09-08 21:52:34');
INSERT INTO public.tender_status_history VALUES (26, 0, '2025-07-02 13:05:07');
INSERT INTO public.tender_status_history VALUES (26, 2, '2025-08-13 03:39:59');
INSERT INTO public.tender_status_history VALUES (26, 1, '2025-08-28 04:12:27');


--
-- TOC entry 3484 (class 0 OID 16442)
-- Dependencies: 232
-- Data for Name: tenders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (2, 6,  'Адаптация динамичных интернет-услуг тендер','Адаптация динамичных интернет-услуг тендер', 'Лот 3953803026', 'Реестр 0455204815', 257193.47, 95270.95, '2025-01-03 02:05:29', '2025-01-16 02:05:29', '2025-01-04 02:05:29', NULL, NULL, NULL, NULL, NULL, NULL, 'Контракт 204', '2025-01-04', 49, false, '2025-01-23 02:05:29', 150);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (3, 4,  'Максимизация соблазнительных технологий лот','Максимизация соблазнительных технологий лот', 'Лот 8137737785', 'Реестр 1276564196', 336825.72, 96000.31, '2025-01-01 19:36:08', '2025-01-10 19:36:08', '2025-01-03 19:36:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 52, false, '2025-01-19 19:36:08', 164);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (4, 3,  'Разработка современных действий тендер','Разработка современных действий тендер', 'Лот 5049995680', 'Реестр 0527654821', 340420.53, 263422.29, '2025-01-03 05:03:50', '2025-02-02 05:03:50', '2025-01-11 05:03:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 49, false, '2025-01-03 05:03:50', 148);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (5, 6,  'Оцифровка прозрачных отношений тендер','Оцифровка прозрачных отношений тендер', 'Лот 7540928489', 'Реестр 6238792657', 397644.11, 74874.54, '2025-01-01 15:09:48', '2025-01-23 15:09:48', '2025-01-19 15:09:48', NULL, NULL, NULL, NULL, NULL, NULL, 'Контракт 387', '2025-01-06', 38, false, '2025-01-25 15:09:48', 119);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (6, 5,  'Оптимизация притягательных архитектур лот','Оптимизация притягательных архитектур лот', 'Лот 1975780847', 'Реестр 9802425894', 220281.13, 175909.00, '2025-01-04 07:37:23', '2025-01-08 07:37:23', '2025-01-08 07:37:23', NULL, NULL, NULL, NULL, NULL, NULL, 'Контракт 344', '2025-01-01', 49, false, '2025-01-27 07:37:23', 149);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (7, 5,  'Производство притягательных интернет-компаний лот','Производство притягательных интернет-компаний лот', 'Лот 3457032709', 'Реестр 4505284987', 464282.83, 58434.14, '2025-01-04 18:31:57', '2025-01-27 18:31:57', '2025-01-12 18:31:57', NULL, NULL, NULL, NULL, NULL, NULL, 'Контракт 444', '2025-01-01', 37, false, '2025-01-08 18:31:57', 65);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (8, 4,  'Развитие онлайн и офлайн приложений лот','Развитие онлайн и офлайн приложений лот', 'Лот 8921961401', 'Реестр 1769496867', 140181.88, 111773.69, '2025-01-04 02:32:03', '2025-01-28 02:32:03', '2025-02-01 02:32:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 53, false, '2025-01-19 02:32:03', 172);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (9, 1,  'Управление инновационных инфраструктур тендер','Управление инновационных инфраструктур тендер', 'Лот 9309493248', 'Реестр 5755447293', 422811.34, 77040.66, '2025-01-02 12:37:47', '2025-01-02 12:37:47', '2025-01-02 12:37:47', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 39, false, '2025-01-02 12:37:47', 73);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (10, 4, 'Включение лучших в своём роде инициатив лот', 'Включение лучших в своём роде инициатив лот', 'Лот 0952183845', 'Реестр 2622516491', 38023.42, 33461.24, '2025-01-02 06:00:01', '2025-01-31 06:00:01', '2025-01-22 06:00:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 37, false, '2025-01-22 06:00:01', 62);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (11, 6, 'Интеграция корпоративных интернет-магазинов лот', 'Интеграция корпоративных интернет-магазинов лот', 'Лот 0129731550', 'Реестр 5555282653', 474650.02, 105641.55, '2025-01-06 09:41:18', '2025-01-16 09:41:18', '2025-01-18 09:41:18', NULL, NULL, NULL, NULL, NULL, NULL, 'Контракт 890', '2025-01-01', 41, false, '2025-01-28 09:41:18', 86);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (12, 5, 'Развитие интегрированных интерфейсов тендер', 'Развитие интегрированных интерфейсов тендер', 'Лот 1462704187', 'Реестр 1839618575', 367961.57, 251229.17, '2025-01-04 21:04:48', '2025-01-28 21:04:48', '2025-01-29 21:04:48', NULL, NULL, NULL, NULL, NULL, NULL, 'Контракт 184', '2025-01-02', 37, false, '2025-01-11 21:04:48', 65);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (13, 3, 'Внедрение наглядных областей интереса лот', 'Внедрение наглядных областей интереса лот', 'Лот 2961096177', 'Реестр 3153336106', 137869.17, 7470.38, '2025-01-04 21:12:43', '2025-01-05 21:12:43', '2025-01-15 21:12:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 37, false, '2025-01-04 21:12:43', 64);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (14, 6, 'Оцифровка прибыльных взаимодействий тендер', 'Оцифровка прибыльных взаимодействий тендер', 'Лот 0124792437', 'Реестр 9797256133', 298488.78, 88501.36, '2025-01-04 15:39:55', '2025-01-28 15:39:55', '2025-01-27 15:39:55', NULL, NULL, NULL, NULL, NULL, NULL, 'Контракт 262', '2025-01-01', 51, false, '2025-01-25 15:39:55', 159);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (15, 2, 'Модернизация расширяемых результатов лот', 'Модернизация расширяемых результатов лот', 'Лот 0317261311', 'Реестр 4237730273', 237049.35, 47367.20, '2025-01-02 20:04:41', '2025-01-28 20:04:41', '2025-01-02 20:04:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 41, false, '2025-01-02 20:04:41', 84);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (16, 5, 'Инновация соблазнительных каналов тендер', 'Инновация соблазнительных каналов тендер', 'Лот 7812154476', 'Реестр 6549628749', 18938.18, 4412.52, '2025-01-06 17:58:05', '2025-01-21 17:58:05', '2025-01-22 17:58:05', NULL, NULL, NULL, NULL, NULL, NULL, 'Контракт 031', '2025-01-05', 51, false, '2025-01-24 17:58:05', 159);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (17, 3, 'Трансформация интегрированных интернет-компаний лот', 'Трансформация интегрированных интернет-компаний лот', 'Лот 9665580850', 'Реестр 9997807223', 398454.62, 98849.50, '2025-01-03 21:35:32', '2025-02-01 21:35:32', '2025-02-01 21:35:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 48, false, '2025-01-03 21:35:32', 144);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (18, 4, 'Включение соблазнительных действий лот', 'Включение соблазнительных действий лот', 'Лот 0394688148', 'Реестр 4969384910', 454245.44, 29940.48, '2025-01-06 12:03:51', '2025-01-20 12:03:51', '2025-01-21 12:03:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 55, false, '2025-01-09 12:03:51', 179);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (19, 3, 'Перепрофилирование целостных порталов лот', 'Перепрофилирование целостных порталов лот', 'Лот 1372829853', 'Реестр 9759315688', 12676.50, 11703.98, '2025-01-01 22:28:13', '2025-01-04 22:28:13', '2025-01-08 22:28:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 40, false, '2025-01-01 22:28:13', 81);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (20, 4, 'Обеспечение корпоративных инфраструктур лот', 'Обеспечение корпоративных инфраструктур лот', 'Лот 7324277977', 'Реестр 4314227861', 319507.26, 107524.87, '2025-01-01 13:26:50', '2025-01-20 13:26:50', '2025-01-30 13:26:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 51, false, '2025-01-03 13:26:50', 162);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (21, 1, 'Максимизация интерактивных интернет-магазинов лот', 'Максимизация интерактивных интернет-магазинов лот', 'Лот 8000287580', 'Реестр 8520763327', 311300.72, 228415.41, '2025-01-06 03:38:13', '2025-01-06 03:38:13', '2025-01-06 03:38:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 52, false, '2025-01-06 03:38:13', 165);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (22, 2, 'Распределение корпоративных инициатив лот', 'Распределение корпоративных инициатив лот', 'Лот 2718154868', 'Реестр 6633469740', 57178.11, 47499.77, '2025-01-06 05:19:57', '2025-01-19 05:19:57', '2025-01-06 05:19:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 45, false, '2025-01-06 05:19:57', 105);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (23, 4, 'Переосмысление виртуальных технологий лот', 'Переосмысление виртуальных технологий лот', 'Лот 6699158250', 'Реестр 8067495942', 211644.26, 123654.83, '2025-01-05 15:50:11', '2025-01-26 15:50:11', '2025-01-22 15:50:11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 38, false, '2025-01-13 15:50:11', 120);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (24, 5, 'Распределение масштабируемых инициатив лот', 'Распределение масштабируемых инициатив лот', 'Лот 3547185683', 'Реестр 8233270407', 78249.80, 38656.79, '2025-01-02 20:30:10', '2025-01-21 20:30:10', '2025-01-25 20:30:10', NULL, NULL, NULL, NULL, NULL, NULL, 'Контракт 329', '2025-01-05', 55, false, '2025-01-04 20:30:10', 180);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (25, 1, 'Управление концептуальных областей интереса лот', 'Управление концептуальных областей интереса лот', 'Лот 1933571350', 'Реестр 5696566482', 387142.45, 101159.17, '2025-01-06 12:36:03', '2025-01-06 12:36:03', '2025-01-06 12:36:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 54, false, '2025-01-06 12:36:03', 174);
INSERT INTO public.tenders OVERRIDING SYSTEM VALUE VALUES (26, 1, 'Приспособление критически важных интернет-продавцов тендер', 'Приспособление критически важных интернет-продавцов тендер', 'Лот 4784375499', 'Реестр 4770280107', 384700.38, 202352.93, '2025-01-01 12:32:12', '2025-01-01 12:32:12', '2025-01-01 12:32:12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 42, false, '2025-01-01 12:32:12', 88);


--
-- TOC entry 3481 (class 0 OID 16432)
-- Dependencies: 229
-- Data for Name: tenders_files; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3486 (class 0 OID 16459)
-- Dependencies: 234
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (5, '12345678', '7f820fc07428cb5a163b5b0ab240105a60255f315b7c67d0531043f906699f1b4704f453795f448f41e344bf2df16459d3474bc7ad5ee51da44fb71f8497bcdc', '83fc6118709cf9930f35e03692310a24', 'viewer');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (1, '123', '2adae0915d90256a9b351bbb1fc424c8051dbc9e50aa0142795cf7c6313679c9fa9e5d2084dc15df1178b8e8ae609d1da4828e9e2ae39a45bcd6e7baf7d865a7', '4bbc21b5c220a97d64eedb2d5d2d1845', 'editor');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (3, 'admin', 'a4c7ff39e5c5d3c6689678a7bcee31fc5f600b8fc56b8aa589ae8bfdf3b25878ea0756ddbbec49ce7074a6fd890694e5a01ff00ba3b6598b6fc008d9b436f851', 'cd7231205416841d9c012f17208c8816', 'admin');
INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (7, 'SuperUser', '31b80a070d38f055a6f94199163010f391795d4c0e738aea0f012b8aa733507bd1e7fb3ce21bda28ebed512061c2e3d9ff699ede5104abc07760c4f50c84b1d4', '44ee97c227a5e4e5bf9a651226c324b8', 'admin');


--
-- TOC entry 3497 (class 0 OID 0)
-- Dependencies: 218
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.companies_id_seq', 55, true);


--
-- TOC entry 3498 (class 0 OID 0)
-- Dependencies: 220
-- Name: contact_persons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_persons_id_seq', 182, true);


--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 222
-- Name: date_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.date_requests_id_seq', 824, true);


--
-- TOC entry 3500 (class 0 OID 0)
-- Dependencies: 224
-- Name: document_requests_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.document_requests_files_id_seq', 72, true);


--
-- TOC entry 3501 (class 0 OID 0)
-- Dependencies: 227
-- Name: rebidding_prices_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rebidding_prices_files_id_seq', 15, true);


--
-- TOC entry 3502 (class 0 OID 0)
-- Dependencies: 228
-- Name: request_prices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.request_prices_id_seq', 717, true);


--
-- TOC entry 3503 (class 0 OID 0)
-- Dependencies: 230
-- Name: tender_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tender_files_id_seq', 77, true);


--
-- TOC entry 3504 (class 0 OID 0)
-- Dependencies: 233
-- Name: tenders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tenders_id_seq', 26, true);


--
-- TOC entry 3505 (class 0 OID 0)
-- Dependencies: 235
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- TOC entry 3284 (class 2606 OID 16469)
-- Name: companies companies_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_name_key UNIQUE (name);


--
-- TOC entry 3286 (class 2606 OID 16471)
-- Name: companies companies_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pk PRIMARY KEY (id);


--
-- TOC entry 3288 (class 2606 OID 16473)
-- Name: contact_persons contact_persons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_persons
    ADD CONSTRAINT contact_persons_pkey PRIMARY KEY (id);


--
-- TOC entry 3290 (class 2606 OID 16475)
-- Name: contact_persons contact_persons_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_persons
    ADD CONSTRAINT contact_persons_unique UNIQUE (name, company_id, email, phone_number);


--
-- TOC entry 3294 (class 2606 OID 16477)
-- Name: document_requests_files document_requests_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_requests_files
    ADD CONSTRAINT document_requests_files_pkey PRIMARY KEY (id);


--
-- TOC entry 3296 (class 2606 OID 16479)
-- Name: rebidding_prices prices_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rebidding_prices
    ADD CONSTRAINT prices_pk PRIMARY KEY (id);


--
-- TOC entry 3298 (class 2606 OID 16481)
-- Name: rebidding_prices_files rebidding_prices_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rebidding_prices_files
    ADD CONSTRAINT rebidding_prices_files_pkey PRIMARY KEY (id);


--
-- TOC entry 3292 (class 2606 OID 16483)
-- Name: document_requests requests_dates_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_requests
    ADD CONSTRAINT requests_dates_pk PRIMARY KEY (id);


--
-- TOC entry 3300 (class 2606 OID 16485)
-- Name: tenders_files tender_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders_files
    ADD CONSTRAINT tender_files_pkey PRIMARY KEY (id);


--
-- TOC entry 3303 (class 2606 OID 16487)
-- Name: tender_status_history tender_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tender_status_history
    ADD CONSTRAINT tender_status_history_pkey PRIMARY KEY (tender_id, status, changed_at);


--
-- TOC entry 3305 (class 2606 OID 16489)
-- Name: tenders tenders_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders
    ADD CONSTRAINT tenders_pk PRIMARY KEY (id);


--
-- TOC entry 3309 (class 2606 OID 16493)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3311 (class 2606 OID 16495)
-- Name: users users_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_unique UNIQUE (name);


--
-- TOC entry 3301 (class 1259 OID 16496)
-- Name: idx_tender_status_history_tender_id_changed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tender_status_history_tender_id_changed_at ON public.tender_status_history USING btree (tender_id, changed_at DESC);


--
-- TOC entry 3312 (class 1259 OID 16551)
-- Name: tender_status_cache_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tender_status_cache_idx ON public.tender_status_cache USING btree (date, status);


--
-- TOC entry 3322 (class 2620 OID 16497)
-- Name: tenders tr_log_status_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_log_status_change AFTER INSERT OR UPDATE OF status ON public.tenders FOR EACH ROW EXECUTE FUNCTION public.log_status_change();


--
-- TOC entry 3313 (class 2606 OID 16498)
-- Name: contact_persons contact_persons_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_persons
    ADD CONSTRAINT contact_persons_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- TOC entry 3315 (class 2606 OID 16503)
-- Name: document_requests_files document_requests_files_document_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_requests_files
    ADD CONSTRAINT document_requests_files_document_request_id_fkey FOREIGN KEY (document_request_id) REFERENCES public.document_requests(id);


--
-- TOC entry 3316 (class 2606 OID 16508)
-- Name: rebidding_prices prices_tenders_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rebidding_prices
    ADD CONSTRAINT prices_tenders_fk FOREIGN KEY (tender_id) REFERENCES public.tenders(id);


--
-- TOC entry 3317 (class 2606 OID 16513)
-- Name: rebidding_prices_files rebidding_prices_files_rebidding_prices_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rebidding_prices_files
    ADD CONSTRAINT rebidding_prices_files_rebidding_prices_id_fkey FOREIGN KEY (rebidding_price_id) REFERENCES public.rebidding_prices(id);


--
-- TOC entry 3314 (class 2606 OID 16518)
-- Name: document_requests requests_dates_tenders_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_requests
    ADD CONSTRAINT requests_dates_tenders_fk FOREIGN KEY (tender_id) REFERENCES public.tenders(id);


--
-- TOC entry 3318 (class 2606 OID 16523)
-- Name: tenders_files tender_files_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders_files
    ADD CONSTRAINT tender_files_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.tenders(id);


--
-- TOC entry 3319 (class 2606 OID 16528)
-- Name: tender_status_history tender_status_history_tender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tender_status_history
    ADD CONSTRAINT tender_status_history_tender_id_fkey FOREIGN KEY (tender_id) REFERENCES public.tenders(id) ON DELETE CASCADE;


--
-- TOC entry 3320 (class 2606 OID 16533)
-- Name: tenders tenders_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders
    ADD CONSTRAINT tenders_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- TOC entry 3321 (class 2606 OID 16538)
-- Name: tenders tenders_contact_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenders
    ADD CONSTRAINT tenders_contact_person_id_fkey FOREIGN KEY (contact_person_id) REFERENCES public.contact_persons(id);


--
-- TOC entry 3488 (class 0 OID 16543)
-- Dependencies: 236 3490
-- Name: tender_status_cache; Type: MATERIALIZED VIEW DATA; Schema: public; Owner: -
--

REFRESH MATERIALIZED VIEW public.tender_status_cache;


-- Completed on 2025-02-28 20:24:21

--
-- PostgreSQL database dump complete
--

