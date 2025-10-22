-- SQL Server DDL (Data Definition Language)
CREATE DATABASE IntelligentSystemDB;

GO
USE IntelligentSystemDB;
GO


------------------------------------------------------
-- TABLE 1: ACCOUNT
------------------------------------------------------
CREATE TABLE ACCOUNT (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(255) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Gender BIT, -- 0: Male, 1:Female
    Phone VARCHAR(20)
);

------------------------------------------------------
-- TABLE 2: AREA
------------------------------------------------------
CREATE TABLE AREA (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Commune NVARCHAR(100) NOT NULL,
    Province NVARCHAR(100),
    Country NVARCHAR(100)
);

------------------------------------------------------
-- TABLE 3: POLICE
------------------------------------------------------
CREATE TABLE POLICE (
    ID INT PRIMARY KEY,
    Patrol_Car_number NVARCHAR(255) UNIQUE
);

------------------------------------------------------
-- TABLE 4: VOLUNTEER
------------------------------------------------------
CREATE TABLE VOLUNTEER (
    ID INT PRIMARY KEY,
    VolunteerStatus BIT,
    DateJoined DATE,
    SKILL NVARCHAR(255),
    FOREIGN KEY (ID) REFERENCES ACCOUNT(ID)
);

------------------------------------------------------
-- TABLE 5: CARE_PARTNER
------------------------------------------------------
CREATE TABLE REPORTER (
    ID INT PRIMARY KEY,
    PARNER_Status BIT,
    FOREIGN KEY (ID) REFERENCES ACCOUNT(ID)
);

------------------------------------------------------
-- TABLE 6: CCTV
------------------------------------------------------
CREATE TABLE CCTV (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255),
    Status NVARCHAR(50),
    IP NVARCHAR(50),
    Port INT,
    ID_Area INT REFERENCES AREA(ID)
);

------------------------------------------------------
-- TABLE 7: MISSING_DOCUMENT
------------------------------------------------------
CREATE TABLE MISSING_DOCUMENT (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Birthday DATE,
    Gender BIT,
    IdentityCardNumber VARCHAR(100),
    Height NVARCHAR(20),
    IdentifyingCharacteristic NTEXT,
    FacePictureUrl VARCHAR(MAX),
    MissingTime DATETIME,
    ReportDate DATETIME,
    UpdateDate DATETIME,
    Status BIT NOT NULL DEFAULT 0,
    ID_MissingArea INT,
    ID_Reporter INT,
    FOREIGN KEY (ID_Reporter) REFERENCES CARE_PARTNER(ID),
    FOREIGN KEY (ID_MissingArea) REFERENCES AREA(ID)
);

------------------------------------------------------
-- TABLE 8: MANAGE_DOCUMENT
------------------------------------------------------
CREATE TABLE MANAGE_DOCUMENT (
    ID_Police INT NOT NULL,
    ID_MissingDocument INT NOT NULL,
    Descripton NVARCHAR(MAX),
    FoundDate DATETIME,
    FoundPersonPicture VARCHAR(MAX),
    ConfirmTime DATETIME,
    UpdateTime DATETIME,
    Find_Place NVARCHAR(MAX),
    ID_FoundVolunteer INT,
    FOREIGN KEY (ID_Police) REFERENCES POLICE(ID),
    FOREIGN KEY (ID_MissingDocument) REFERENCES MISSING_DOCUMENT(ID),
    FOREIGN KEY (ID_FoundVolunteer) REFERENCES VOLUNTEER(ID),
    CONSTRAINT PK_ManageDocument PRIMARY KEY (ID_Police, ID_MissingDocument)
);

------------------------------------------------------
-- TABLE 9: INTERESTING_PROFILE
------------------------------------------------------
CREATE TABLE INTEREST_PROFILE (
    ID_MissingDocument INT  NOT NULL,
    ID_Volunteer INT NOT NULL,
    InterestingDate DATETIME,
    FoundDate DATETIME,
    FoundPicture VARCHAR(MAX),
    FoundArea INT,
    Descripton NVARCHAR(MAX),
    FOREIGN KEY (ID_MissingDocument) REFERENCES MISSING_DOCUMENT(ID),
    FOREIGN KEY (ID_Volunteer) REFERENCES VOLUNTEER(ID),
    FOREIGN KEY (FoundArea) REFERENCES AREA(ID),
    CONSTRAINT PK_InterestingProfile PRIMARY KEY (ID_MissingDocument, ID_Volunteer)
);

------------------------------------------------------
-- TABLE 10: CCTV_REPORT
------------------------------------------------------
CREATE TABLE CCTV_REPORT (
    ID_CCTV INT,
    ID_MissingDocument INT,
    Detail NVARCHAR(MAX),
    TimeReport DATETIME,
    Status BIT,
    Confident FLOAT,
    DetectionLog NVARCHAR(255),
    DetectPicture VARCHAR(MAX),
    FOREIGN KEY (ID_CCTV) REFERENCES CCTV(ID),
    FOREIGN KEY (ID_MissingDocument) REFERENCES MISSING_DOCUMENT(ID),
    CONSTRAINT PK_CCTV_REPORT PRIMARY KEY (ID_CCTV, ID_MissingDocument, TimeReport)
);

------------------------------------------------------
-- TABLE 12: DETAIL_AREA_ACCOUNT
------------------------------------------------------
CREATE TABLE DETAIL_AREA_ACCOUNT (
    ID_Area INT,
    ID_Account INT,
    FOREIGN KEY (ID_Area) REFERENCES AREA(ID),
    FOREIGN KEY (ID_Account) REFERENCES ACCOUNT(ID)
);

------------------------------------------------------
-- INSERT DATA
------------------------------------------------------
SET DATEFORMAT ymd;
-- Dữ liệu mẫu được thêm vào ngày 2025-10-20

------------------------------------------------------
-- TABLE 1: ACCOUNT (Sử dụng ID 1-4)
------------------------------------------------------
INSERT INTO ACCOUNT (Username, Password, Email, Gender, Phone) VALUES
('police_trung', 'pass_p1', 'trung.police@gov.vn', 0, '0901234567'),   -- ID 1: Police
('partner_lien', 'pass_c2', 'lien.care@mail.com', 1, '0907654321'),     -- ID 2: Care Partner
('volun_minh', 'pass_v3', 'minh.volun@mail.com', 0, '0912233445'),      -- ID 3: Volunteer
('admin_cctv', 'admin_pass', 'admin@cctv.com', NULL, NULL);             -- ID 4: Admin (Không được sử dụng làm FK)

------------------------------------------------------
-- TABLE 2: AREA (Sử dụng ID 1-3)
------------------------------------------------------
INSERT INTO AREA (Commune, Province, Country) VALUES
(N'Phường Bến Nghé', N'TP. Hồ Chí Minh', N'Việt Nam'),     -- ID 1: Khu vực 1 (Mất tích)
(N'Xã Hòa Thạch', N'Hà Nội', N'Việt Nam'),                  -- ID 2: Khu vực 2 (Phát hiện)
(N'Thị trấn Liên Nghĩa', N'Lâm Đồng', N'Việt Nam');         -- ID 3: Khu vực 3

------------------------------------------------------
-- TABLE 3, 4, 5: POLICE, VOLUNTEER, CARE_PARTNER
------------------------------------------------------
-- POLICE (ID = 1)
INSERT INTO POLICE (ID, Patrol_Car_number) VALUES
(1, 'HCM-PC-001');

-- CARE_PARTNER (ID = 2)
INSERT INTO CARE_PARTNER (ID, PARNER_Status) VALUES
(2, 1); -- Trạng thái Hoạt động

-- VOLUNTEER (ID = 3)
INSERT INTO VOLUNTEER (ID, VolunteerStatus, DateJoined, SKILL) VALUES
(3, 1, '2024-05-01', N'Phân tích video, Tìm kiếm ngoài trời');

------------------------------------------------------
-- TABLE 6: CCTV
------------------------------------------------------
INSERT INTO CCTV (Name, Status, IP, Port, ID_Area) VALUES
(N'Camera Ngã 5 P. Bến Nghé', 'Online', '192.168.1.100', 8080, 1), -- ID 1: Tại khu vực mất tích
(N'Camera Trạm Xe Buýt X. Hòa Thạch', 'Online', '192.168.1.101', 8080, 2); -- ID 2: Tại khu vực phát hiện

------------------------------------------------------
-- TABLE 7: MISSING_DOCUMENT
------------------------------------------------------
INSERT INTO MISSING_DOCUMENT (Name, Birthday, Gender, IdentityCardNumber, Height, IdentifyingCharacteristic, FacePictureUrl, MissingTime, ReportDate, UpdateDate, Status, ID_MissingArea, ID_Reporter) VALUES
(N'Trần Thị Mai', '1960-08-20', 1, '123456789', N'1m50', N'Có nốt ruồi dưới mắt phải, tóc bạc', 'url_hinh_mai.jpg', '2025-10-19 09:30:00', GETDATE(), GETDATE(), 0, 1, 2);
-- ID 1: Hồ sơ mất tích của cô Mai. Báo cáo bởi Partner ID 2 (Lien). Mất tại Area ID 1.

------------------------------------------------------
-- TABLE 12: DETAIL_AREA_ACCOUNT
------------------------------------------------------
-- Police Trung (ID 1) chịu trách nhiệm theo dõi Khu vực 1
INSERT INTO DETAIL_AREA_ACCOUNT (ID_Area, ID_Account) VALUES
(1, 1),
(2, 3); -- Volunteer Minh (ID 3) theo dõi Khu vực 2

------------------------------------------------------
-- TABLE 9: INTEREST_PROFILE
------------------------------------------------------
-- Volunteer Minh (ID 3) quan tâm đến hồ sơ mất tích ID 1
INSERT INTO INTEREST_PROFILE (ID_MissingDocument, ID_Volunteer, InterestingDate, FoundDate, FoundPicture, FoundArea, Descripton) VALUES
(1, 3, GETDATE(), NULL, NULL, 2, N'Tình nguyện viên Minh bắt đầu tìm kiếm tại khu vực Hòa Thạch (Area 2).');

------------------------------------------------------
-- TABLE 10: CCTV_REPORT
------------------------------------------------------
-- CCTV 1 phát hiện người mất tích ID 1
INSERT INTO CCTV_REPORT (ID_CCTV, ID_MissingDocument, Detail, TimeReport, Status, Confident, DetectionLog, DetectPicture) VALUES
(1, 1, N'AI phát hiện khuôn mặt tương đồng 92% với Trần Thị Mai.', '2025-10-19 10:05:00', 0, 0.92, 'DET-CCTV1-20251019-01', 'url_hinh_phat_hien_1.jpg');

------------------------------------------------------
-- TABLE 8: MANAGE_DOCUMENT
------------------------------------------------------
-- Cảnh sát Trung (ID 1) tiếp nhận hồ sơ ID 1 và ghi nhận đã tìm thấy nhờ Volunteer Minh (ID 3)
INSERT INTO MANAGE_DOCUMENT (ID_Police, ID_MissingDocument, Descripton, FoundDate, FoundPersonPicture, ConfirmTime, UpdateTime, Find_Place, ID_FoundVolunteer) VALUES
(1, 1, N'Người mất tích Trần Thị Mai đã được tìm thấy tại Trạm Xe Buýt Hòa Thạch, HN. Hồ sơ đã được đóng.', '2025-10-20 12:00:00', 'url_hinh_tim_thay_mai.jpg', '2025-10-20 13:00:00', GETDATE(), N'Trạm Xe Buýt Xã Hòa Thạch, Hà Nội', 3);

-- Cập nhật trạng thái người mất tích thành Đã tìm thấy (Status = 1)
UPDATE MISSING_DOCUMENT SET Status = 1, UpdateDate = GETDATE() WHERE ID = 1;