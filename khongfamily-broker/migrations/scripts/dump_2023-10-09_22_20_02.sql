--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE khongfamily;




--
-- Drop roles
--

DROP ROLE khongadmin;


--
-- Roles
--

CREATE ROLE khongadmin;
ALTER ROLE khongadmin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:pkSGaOwfEpGmh3v26w00uQ==$m6Uvb095iyFU4OpLRNYPTNrWbkgsbKv5GHaYF7KgsOU=:q8PQNavXRsZV1ccfsGQOka5OVZI58ugpUf64cOWD7qw=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: khongadmin
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO khongadmin;

\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: khongadmin
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: khongadmin
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: khongadmin
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "khongfamily" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: khongfamily; Type: DATABASE; Schema: -; Owner: khongadmin
--

CREATE DATABASE khongfamily WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE khongfamily OWNER TO khongadmin;

\connect khongfamily

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: finance_expenses_category; Type: TABLE; Schema: public; Owner: khongadmin
--

CREATE TABLE public.finance_expenses_category (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    remarks character varying(256),
    created_at date NOT NULL,
    updated_at date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.finance_expenses_category OWNER TO khongadmin;

--
-- Name: finance_expenses_category_id_seq; Type: SEQUENCE; Schema: public; Owner: khongadmin
--

CREATE SEQUENCE public.finance_expenses_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.finance_expenses_category_id_seq OWNER TO khongadmin;

--
-- Name: finance_expenses_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khongadmin
--

ALTER SEQUENCE public.finance_expenses_category_id_seq OWNED BY public.finance_expenses_category.id;


--
-- Name: finance_expenses_records; Type: TABLE; Schema: public; Owner: khongadmin
--

CREATE TABLE public.finance_expenses_records (
    id integer NOT NULL,
    date date NOT NULL,
    name character varying(256) NOT NULL,
    category_id integer NOT NULL,
    currency character varying(256) NOT NULL,
    amount double precision NOT NULL,
    is_fixed_expenses boolean NOT NULL,
    remarks character varying(256),
    is_paid boolean NOT NULL,
    created_at date NOT NULL,
    updated_at date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.finance_expenses_records OWNER TO khongadmin;

--
-- Name: finance_expenses_records_id_seq; Type: SEQUENCE; Schema: public; Owner: khongadmin
--

CREATE SEQUENCE public.finance_expenses_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.finance_expenses_records_id_seq OWNER TO khongadmin;

--
-- Name: finance_expenses_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khongadmin
--

ALTER SEQUENCE public.finance_expenses_records_id_seq OWNED BY public.finance_expenses_records.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: khongadmin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    password character varying(256) NOT NULL,
    email character varying(256) NOT NULL,
    profile_image character varying(256)
);


ALTER TABLE public.users OWNER TO khongadmin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: khongadmin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO khongadmin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khongadmin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: finance_expenses_category id; Type: DEFAULT; Schema: public; Owner: khongadmin
--

ALTER TABLE ONLY public.finance_expenses_category ALTER COLUMN id SET DEFAULT nextval('public.finance_expenses_category_id_seq'::regclass);


--
-- Name: finance_expenses_records id; Type: DEFAULT; Schema: public; Owner: khongadmin
--

ALTER TABLE ONLY public.finance_expenses_records ALTER COLUMN id SET DEFAULT nextval('public.finance_expenses_records_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: khongadmin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: finance_expenses_category; Type: TABLE DATA; Schema: public; Owner: khongadmin
--

COPY public.finance_expenses_category (id, name, remarks, created_at, updated_at) FROM stdin;
1	Car Loan		2023-05-03	2023-05-03
2	Mortgage Loan		2023-05-03	2023-05-03
3	Credit Card		2023-05-03	2023-05-03
4	Insurance		2023-05-03	2023-05-03
5	Home Internet		2023-05-03	2023-05-03
6	Water Bill		2023-05-03	2023-05-03
7	Electric Bill		2023-05-03	2023-05-03
8	Credit Card Loan		2023-05-03	2023-05-03
9	Children Fees		2023-05-03	2023-05-03
10	Others		2023-05-03	2023-05-03
11	General Expenses		2023-05-03	2023-05-03
\.


--
-- Data for Name: finance_expenses_records; Type: TABLE DATA; Schema: public; Owner: khongadmin
--

COPY public.finance_expenses_records (id, date, name, category_id, currency, amount, is_fixed_expenses, remarks, is_paid, created_at, updated_at) FROM stdin;
1	2023-04-02	Citibank Loan	8	MYR	583	t	60 months	t	2023-05-03	2023-05-03
2	2023-04-01	Indah Square	2	MYR	1600	t		t	2023-05-03	2023-05-03
3	2023-04-03	Hong Leong Bank Wise Card	3	MYR	2750	f		t	2023-05-03	2023-05-03
4	2023-04-03	Standard Charted Credit Card	4	MYR	700	t		t	2023-05-03	2023-05-03
5	2023-04-03	WD5840A	1	MYR	1050	t		t	2023-05-03	2023-05-03
6	2023-04-03	JSC8852	1	MYR	602	t		t	2023-05-03	2023-05-03
7	2023-04-03	TNB Bill	7	MYR	264.3	t		t	2023-05-03	2023-05-03
8	2023-04-03	Unifi Bill	5	MYR	147.35	t		t	2023-05-03	2023-05-03
9	2023-04-03	SAJ Bill	6	MYR	28	t		t	2023-05-03	2023-05-03
10	2023-04-03	School Transport	9	MYR	220	t		t	2023-05-03	2023-05-03
11	2023-04-03	Janice Tuition Fees	9	MYR	635	t		t	2023-05-03	2023-05-03
12	2023-04-03	Jasper Nanny Fees	9	MYR	1800	t		t	2023-05-03	2023-05-03
13	2023-04-03	General Expenses	11	MYR	4000	t	KW, CL and Mum	t	2023-05-03	2023-05-03
14	2023-05-03	Standard Charted Credit Card	4	MYR	700	t		t	2023-05-03	2023-05-03
15	2023-05-03	Citibank Loan	8	MYR	583	t		t	2023-05-03	2023-05-03
16	2023-05-03	Hong Leong Bank	3	MYR	2620	f		t	2023-05-03	2023-05-03
17	2023-05-03	WD5840A	1	MYR	1050	t		t	2023-05-03	2023-05-03
18	2023-05-03	Indah Square	2	MYR	1600	t		t	2023-05-03	2023-05-03
19	2023-05-03	SAJ Bill	6	MYR	50.03	t		t	2023-05-03	2023-05-03
20	2023-05-03	Transport Fees	9	MYR	260	t		t	2023-05-03	2023-05-03
21	2023-05-03	Jasper Nanny Fees	9	MYR	1800	t		t	2023-05-03	2023-05-03
22	2023-05-03	Janice Tuition Fees	9	MYR	635	t		t	2023-05-03	2023-05-03
23	2023-05-03	JSC8852	1	MYR	602	t		t	2023-05-03	2023-05-03
24	2023-05-03	General Expenses	11	MYR	4000	t	KW, CL and Mum	t	2023-05-03	2023-05-03
25	2023-05-03	Cigarette	10	MYR	666	t		t	2023-05-03	2023-05-03
26	2023-04-01	Cigarette	10	MYR	666	t		t	2023-05-03	2023-05-03
27	2023-05-19	WD5840A Service Fees	10	MYR	870	f	Change spark plugs	t	2023-05-19	2023-05-19
28	2023-05-19	Road tax and insurance	10	MYR	2845.27	f	WD5840A	t	2023-05-19	2023-05-19
29	2023-06-15	KW and CL	11	MYR	3000	t		t	2023-06-15	2023-06-15
30	2023-06-15	Mother KW	11	MYR	1500	t		t	2023-06-15	2023-06-15
31	2023-06-15	Maybank	3	MYR	953.68	f		t	2023-06-15	2023-06-15
32	2023-06-15	Hong Leong Bank	3	MYR	2351.32	f		t	2023-06-15	2023-06-15
33	2023-06-15	WD5840A	1	MYR	1050	t		t	2023-06-15	2023-06-15
34	2023-06-15	Indah Square	2	MYR	1700	t		t	2023-06-15	2023-06-15
35	2023-06-15	JSC8852	1	MYR	610	t		t	2023-06-15	2023-06-15
36	2023-06-15	YY Tuition Fees	9	MYR	635	t		t	2023-06-15	2023-06-15
37	2023-06-15	School Transport	9	MYR	280	t		t	2023-06-15	2023-06-15
38	2023-06-15	Citibank	3	MYR	585	t	Credit Card Loan	t	2023-06-15	2023-06-15
39	2023-06-15	Standard Charted Credit Card	4	MYR	1337	t		t	2023-06-15	2023-06-15
40	2023-06-15	TNB	7	MYR	411.8	t		t	2023-06-15	2023-06-15
41	2023-06-15	Jasper Nanny Fees	9	MYR	1800	t		t	2023-06-15	2023-06-15
42	2023-08-01	WD5840A	1	MYR	1050	t	Aug 2023	t	2023-07-30	2023-07-30
43	2023-08-01	Indah Square	2	MYR	1700	t		t	2023-07-30	2023-07-30
44	2023-08-01	School Bus Fare	9	MYR	280	t		t	2023-07-30	2023-07-30
45	2023-08-01	TNB	7	MYR	415.95	t		t	2023-07-30	2023-07-30
46	2023-08-01	Janice's Tuition 	9	MYR	735	t		t	2023-07-30	2023-07-30
47	2023-08-01	General expenses	11	MYR	3000	t		t	2023-07-30	2023-07-30
48	2023-08-01	Mummy's Household	11	MYR	1500	t		t	2023-07-30	2023-07-30
49	2023-09-01	WD5840A	1	MYR	1050	t	Aug 2023	t	2023-09-04	2023-09-04
50	2023-09-01	55 INDAH SQUARE	2	MYR	1700	t		t	2023-09-04	2023-09-04
51	2023-09-01	MYVI 8852	1	MYR	670.01	t		t	2023-09-04	2023-09-04
52	2023-09-01	KKW HLB 	3	MYR	1806.57	f		t	2023-09-04	2023-09-04
53	2023-09-01	KHONG FAMILY INSURANCE	4	MYR	980	t	Standard Charted Credit Card	t	2023-09-04	2023-09-04
54	2023-09-01	TNB 	7	MYR	440.25	t		t	2023-09-04	2023-09-04
55	2023-09-01	School Bus Fare	9	MYR	280	f		t	2023-09-04	2023-09-04
56	2023-09-01	Janice’s tuition 	9	MYR	500	t	foon yew end	t	2023-09-10	2023-09-10
57	2023-09-11	KKW KCL expenses 	11	MYR	4500	t		t	2023-09-11	2023-09-11
58	2023-09-11	UOB one 	3		1619.9	f		t	2023-09-11	2023-09-11
59	2023-09-11	Jasper	9	MYR	1800	t		t	2023-09-11	2023-09-11
60	2023-09-11	Vape and cigarettes 	10	MYR	1025	f		t	2023-09-11	2023-09-11
61	2023-09-11	Maybank	3	MYR	768.32	f	Petrol	t	2023-09-11	2023-09-11
62	2023-09-11	Citibank	8		585	t		t	2023-09-11	2023-09-11
63	2023-10-01	WD5840A	1	MYR	1050	t		t	2023-09-25	2023-09-25
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: khongadmin
--

COPY public.users (id, name, password, email, profile_image) FROM stdin;
\.


--
-- Name: finance_expenses_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khongadmin
--

SELECT pg_catalog.setval('public.finance_expenses_category_id_seq', 1, false);


--
-- Name: finance_expenses_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khongadmin
--

SELECT pg_catalog.setval('public.finance_expenses_records_id_seq', 63, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khongadmin
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: finance_expenses_category finance_expenses_category_name_key; Type: CONSTRAINT; Schema: public; Owner: khongadmin
--

ALTER TABLE ONLY public.finance_expenses_category
    ADD CONSTRAINT finance_expenses_category_name_key UNIQUE (name);


--
-- Name: finance_expenses_category finance_expenses_category_pkey; Type: CONSTRAINT; Schema: public; Owner: khongadmin
--

ALTER TABLE ONLY public.finance_expenses_category
    ADD CONSTRAINT finance_expenses_category_pkey PRIMARY KEY (id);


--
-- Name: finance_expenses_records finance_expenses_records_pkey; Type: CONSTRAINT; Schema: public; Owner: khongadmin
--

ALTER TABLE ONLY public.finance_expenses_records
    ADD CONSTRAINT finance_expenses_records_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: khongadmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: khongadmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: finance_expenses_records finance_expenses_records_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: khongadmin
--

ALTER TABLE ONLY public.finance_expenses_records
    ADD CONSTRAINT finance_expenses_records_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.finance_expenses_category(id);


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: khongadmin
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO khongadmin;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: khongadmin
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

