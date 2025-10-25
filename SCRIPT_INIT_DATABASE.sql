-- Recreated database script
-- Table names are UPPERCASE, column identifiers use lower_case_with_underscores
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'IntelligentSystemDB')
BEGIN
    ALTER DATABASE [IntelligentSystemDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [IntelligentSystemDB];
END
GO

CREATE DATABASE [IntelligentSystemDB];
GO

USE [IntelligentSystemDB];
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE dbo.ACCOUNT (
    id INT IDENTITY(1,1) NOT NULL,
    username NVARCHAR(255) NOT NULL,
    password VARCHAR(MAX) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(255) NULL,
    birthday DATE NULL,
    address NVARCHAR(MAX) NULL,
    gender BIT NULL,
    phone VARCHAR(20) NULL,
    profile_picture_url VARCHAR(MAX) NULL,
    account_type NVARCHAR(50) NOT NULL,
    account_status BIT NOT NULL CONSTRAINT df_account_account_status DEFAULT ((1)),
    created_at DATETIME NOT NULL CONSTRAINT df_account_created_at DEFAULT (GETDATE()),
    CONSTRAINT pk_account PRIMARY KEY CLUSTERED (id ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE dbo.AREA (
    id INT IDENTITY(1,1) NOT NULL,
    commune NVARCHAR(100) NULL,
    district NVARCHAR(100) NULL,
    province NVARCHAR(100) NOT NULL,
    country NVARCHAR(100) NOT NULL,
    latitude DECIMAL(9,6) NULL,
    longitude DECIMAL(9,6) NULL,
    description NVARCHAR(500) NULL,
    CONSTRAINT pk_area PRIMARY KEY CLUSTERED (id ASC)
) ON [PRIMARY]
GO

CREATE TABLE dbo.CARE_PARTNER (
    id INT NOT NULL,
    partner_status BIT NOT NULL CONSTRAINT df_care_partner_partner_status DEFAULT ((1)),
    partner_type NVARCHAR(100) NULL,
    organization_name NVARCHAR(255) NULL,
    CONSTRAINT pk_care_partner PRIMARY KEY CLUSTERED (id ASC)
) ON [PRIMARY]
GO

CREATE TABLE dbo.CCTV (
    id INT IDENTITY(1,1) NOT NULL,
    name NVARCHAR(255) NULL,
    status NVARCHAR(50) NULL,
    stream_url VARCHAR(MAX) NOT NULL,
    ip NVARCHAR(50) NULL,
    port INT NULL,
    latitude DECIMAL(9,6) NULL,
    longitude DECIMAL(9,6) NULL,
    camera_type NVARCHAR(100) NULL,
    last_online DATETIME NULL,
    id_area INT NULL,
    CONSTRAINT pk_cctv PRIMARY KEY CLUSTERED (id ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE dbo.CCTV_REPORT (
    id INT IDENTITY(1,1) NOT NULL,
    id_cctv INT NULL,
    id_missing_document INT NULL,
    detail NVARCHAR(MAX) NULL,
    time_report DATETIME NOT NULL CONSTRAINT df_cctv_report_time_report DEFAULT (GETDATE()),
    confirmation_status NVARCHAR(50) NOT NULL CONSTRAINT df_cctv_report_confirmation_status DEFAULT ('Pending_Review'),
    confident FLOAT NULL,
    detection_log NVARCHAR(255) NULL,
    detect_picture VARCHAR(MAX) NULL,
    id_police_reviewer INT NULL,
    review_time DATETIME NULL,
    review_notes NVARCHAR(MAX) NULL,
    CONSTRAINT pk_cctv_report PRIMARY KEY CLUSTERED (id ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE dbo.DETAIL_AREA_ACCOUNT (
    id_area INT NOT NULL,
    id_account INT NOT NULL,
    CONSTRAINT pk_detail_area_account PRIMARY KEY CLUSTERED (id_area ASC, id_account ASC)
) ON [PRIMARY]
GO

CREATE TABLE dbo.MANAGE_DOCUMENT (
    id_police INT NOT NULL,
    id_missing_document INT NOT NULL,
    description NVARCHAR(MAX) NULL,
    found_date DATETIME NULL,
    found_person_picture VARCHAR(MAX) NULL,
    confirm_time DATETIME NULL,
    update_time DATETIME NULL,
    find_place NVARCHAR(MAX) NULL,
    confirmation_method NVARCHAR(255) NULL,
    id_found_volunteer INT NULL,
    CONSTRAINT pk_manage_document PRIMARY KEY CLUSTERED (id_police ASC, id_missing_document ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE dbo.MISSING_DOCUMENT (
    id INT IDENTITY(1,1) NOT NULL,
    full_name NVARCHAR(255) NOT NULL,
    birthday DATE NULL,
    gender BIT NULL,
    identity_card_number VARCHAR(100) NULL,
    height NVARCHAR(20) NULL,
    weight NVARCHAR(20) NULL,
    identifying_characteristic NVARCHAR(MAX) NULL,
    last_known_outfit NVARCHAR(MAX) NULL,
    medical_conditions NVARCHAR(MAX) NULL,
    face_picture_url VARCHAR(MAX) NOT NULL,
    missing_time DATETIME NOT NULL,
    report_date DATETIME NOT NULL CONSTRAINT df_missing_document_report_date DEFAULT (GETDATE()),
    update_date DATETIME NULL,
    case_status NVARCHAR(50) NOT NULL CONSTRAINT df_missing_document_case_status DEFAULT ('Missing'),
    reporter_relationship NVARCHAR(100) NULL,
    id_missing_area INT NULL,
    id_reporter INT NULL,
    CONSTRAINT pk_missing_document PRIMARY KEY CLUSTERED (id ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE dbo.POLICE (
    id INT NOT NULL,
    police_code NVARCHAR(50) NULL,
    rank NVARCHAR(100) NULL,
    station NVARCHAR(255) NULL,
    patrol_car_number NVARCHAR(255) NULL,
    CONSTRAINT pk_police PRIMARY KEY CLUSTERED (id ASC)
) ON [PRIMARY]
GO

CREATE TABLE dbo.VOLUNTEER (
    id INT NOT NULL,
    volunteer_status BIT NOT NULL CONSTRAINT df_volunteer_volunteer_status DEFAULT ((1)),
    date_joined DATE NULL,
    skills NVARCHAR(MAX) NULL,
    rating FLOAT NULL CONSTRAINT df_volunteer_rating DEFAULT (3.0),
    CONSTRAINT pk_volunteer PRIMARY KEY CLUSTERED (id ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE dbo.VOLUNTEER_REPORT (
    id INT IDENTITY(1,1) NOT NULL,
    id_missing_document INT NOT NULL,
    id_volunteer INT NOT NULL,
    report_time DATETIME NOT NULL CONSTRAINT df_volunteer_report_time_report DEFAULT (GETDATE()),
    sighting_picture VARCHAR(MAX) NULL,
    sighting_area_id INT NULL,
    latitude DECIMAL(9,6) NULL,
    longitude DECIMAL(9,6) NULL,
    description NVARCHAR(MAX) NULL,
    report_status NVARCHAR(50) NOT NULL CONSTRAINT df_volunteer_report_status DEFAULT ('Submitted'),
    CONSTRAINT pk_volunteer_report PRIMARY KEY CLUSTERED (id ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE dbo.VOLUNTEER_SUBSCRIPTION (
    id_missing_document INT NOT NULL,
    id_volunteer INT NOT NULL,
    subscribed_date DATETIME NOT NULL CONSTRAINT df_volunteer_subscription_subscribed_date DEFAULT (GETDATE()),
    is_active BIT NOT NULL CONSTRAINT df_volunteer_subscription_is_active DEFAULT ((1)),
    CONSTRAINT pk_volunteer_subscription PRIMARY KEY CLUSTERED (id_missing_document ASC, id_volunteer ASC)
) ON [PRIMARY]
GO

-- Foreign keys
ALTER TABLE dbo.CCTV ADD CONSTRAINT fk_cctv_area FOREIGN KEY (id_area) REFERENCES dbo.AREA(id);
GO
ALTER TABLE dbo.CCTV_REPORT ADD CONSTRAINT fk_cctv_report_cctv FOREIGN KEY (id_cctv) REFERENCES dbo.CCTV(id);
GO
ALTER TABLE dbo.CCTV_REPORT ADD CONSTRAINT fk_cctv_report_missing_document FOREIGN KEY (id_missing_document) REFERENCES dbo.MISSING_DOCUMENT(id);
GO
ALTER TABLE dbo.CCTV_REPORT ADD CONSTRAINT fk_cctv_report_police FOREIGN KEY (id_police_reviewer) REFERENCES dbo.POLICE(id);
GO
ALTER TABLE dbo.DETAIL_AREA_ACCOUNT ADD CONSTRAINT fk_detail_area_account_account FOREIGN KEY (id_account) REFERENCES dbo.ACCOUNT(id);
GO
ALTER TABLE dbo.DETAIL_AREA_ACCOUNT ADD CONSTRAINT fk_detail_area_account_area FOREIGN KEY (id_area) REFERENCES dbo.AREA(id);
GO
ALTER TABLE dbo.MANAGE_DOCUMENT ADD CONSTRAINT fk_manage_document_found_volunteer FOREIGN KEY (id_found_volunteer) REFERENCES dbo.VOLUNTEER(id);
GO
ALTER TABLE dbo.MANAGE_DOCUMENT ADD CONSTRAINT fk_manage_document_missing_document FOREIGN KEY (id_missing_document) REFERENCES dbo.MISSING_DOCUMENT(id);
GO
ALTER TABLE dbo.MANAGE_DOCUMENT ADD CONSTRAINT fk_manage_document_police FOREIGN KEY (id_police) REFERENCES dbo.POLICE(id);
GO
ALTER TABLE dbo.MISSING_DOCUMENT ADD CONSTRAINT fk_missing_document_area FOREIGN KEY (id_missing_area) REFERENCES dbo.AREA(id);
GO
ALTER TABLE dbo.MISSING_DOCUMENT ADD CONSTRAINT fk_missing_document_care_partner FOREIGN KEY (id_reporter) REFERENCES dbo.CARE_PARTNER(id);
GO
ALTER TABLE dbo.POLICE ADD CONSTRAINT fk_police_account FOREIGN KEY (id) REFERENCES dbo.ACCOUNT(id) ON DELETE CASCADE;
GO
ALTER TABLE dbo.CARE_PARTNER ADD CONSTRAINT fk_care_partner_account FOREIGN KEY (id) REFERENCES dbo.ACCOUNT(id) ON DELETE CASCADE;
GO
ALTER TABLE dbo.VOLUNTEER ADD CONSTRAINT fk_volunteer_account FOREIGN KEY (id) REFERENCES dbo.ACCOUNT(id) ON DELETE CASCADE;
GO
ALTER TABLE dbo.VOLUNTEER_REPORT ADD CONSTRAINT fk_volunteer_report_missing_document FOREIGN KEY (id_missing_document) REFERENCES dbo.MISSING_DOCUMENT(id);
GO
ALTER TABLE dbo.VOLUNTEER_REPORT ADD CONSTRAINT fk_volunteer_report_volunteer FOREIGN KEY (id_volunteer) REFERENCES dbo.VOLUNTEER(id);
GO
ALTER TABLE dbo.VOLUNTEER_REPORT ADD CONSTRAINT fk_volunteer_report_area FOREIGN KEY (sighting_area_id) REFERENCES dbo.AREA(id);
GO
ALTER TABLE dbo.VOLUNTEER_SUBSCRIPTION ADD CONSTRAINT fk_volunteer_subscription_missing_document FOREIGN KEY (id_missing_document) REFERENCES dbo.MISSING_DOCUMENT(id);
GO
ALTER TABLE dbo.VOLUNTEER_SUBSCRIPTION ADD CONSTRAINT fk_volunteer_subscription_volunteer FOREIGN KEY (id_volunteer) REFERENCES dbo.VOLUNTEER(id);
GO

-- sample inserts (adjust/hashes as needed)
SET IDENTITY_INSERT dbo.ACCOUNT ON;
INSERT INTO dbo.ACCOUNT (id, username, password, email, full_name, birthday, address, gender, phone, profile_picture_url, account_type, account_status, created_at)
VALUES
 (1, N'police_trung', N'hashed_pass_p1', N'trung.police@gov.vn', N'Nguyễn Văn Trung', '1985-05-10', N'123 Võ Văn Tần, Q3, TP.HCM', 0, '0901234567', NULL, N'police', 1, GETDATE()),
 (2, N'partner_lien', N'hashed_pass_c2', N'lien.care@mail.com', N'Trần Thị Liên', '1990-02-15', N'456 Lý Thường Kiệt, Q10, TP.HCM', 1, '0907654321', NULL, N'care_partner', 1, GETDATE());
SET IDENTITY_INSERT dbo.ACCOUNT OFF;
GO

-- unique indexes
CREATE UNIQUE INDEX ux_account_username ON dbo.ACCOUNT (username);
GO
CREATE UNIQUE INDEX ux_account_email ON dbo.ACCOUNT (email);
GO
CREATE UNIQUE INDEX ux_police_patrol_car ON dbo.POLICE (patrol_car_number);
GO
CREATE UNIQUE INDEX ux_police_code ON dbo.POLICE (police_code);
GO
GO