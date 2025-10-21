-- Xóa CSDL cũ nếu tồn tại để chạy lại từ đầu (Tùy chọn)
IF DB_ID('IntelligentSystemDB') IS NOT NULL
BEGIN
    USE master;
    ALTER DATABASE IntelligentSystemDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE IntelligentSystemDB;
END
GO

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
    FullName NVARCHAR(255), 
    Birthday DATE, 
    Address NVARCHAR(MAX), 
    Gender BIT, 
    Phone VARCHAR(20),
    ProfilePictureUrl VARCHAR(MAX),
    AccountType NVARCHAR(50) NOT NULL, 
    AccountStatus BIT NOT NULL DEFAULT 1, 
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE() 
);

------------------------------------------------------
-- TABLE 2: AREA 
------------------------------------------------------
CREATE TABLE AREA (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Commune NVARCHAR(100),
    District NVARCHAR(100), 
    Province NVARCHAR(100) NOT NULL, 
    Country NVARCHAR(100) NOT NULL,
    Latitude DECIMAL(9, 6), -- Bổ sung: Vĩ độ
    Longitude DECIMAL(9, 6), -- Bổ sung: Kinh độ
    Description NVARCHAR(500) 
);

------------------------------------------------------
-- TABLE 3: POLICE 
------------------------------------------------------
CREATE TABLE POLICE (
    ID INT PRIMARY KEY, 
    PoliceCode NVARCHAR(50) UNIQUE, 
    Rank NVARCHAR(100),
    Station NVARCHAR(255), 
    Patrol_Car_number NVARCHAR(255) UNIQUE,
    FOREIGN KEY (ID) REFERENCES ACCOUNT(ID) ON DELETE CASCADE 
);

------------------------------------------------------
-- TABLE 4: VOLUNTEER 
------------------------------------------------------
CREATE TABLE VOLUNTEER (
    ID INT PRIMARY KEY, 
    VolunteerStatus BIT NOT NULL DEFAULT 1,
    DateJoined DATE,
    Skills NTEXT, 
    Rating FLOAT DEFAULT 3.0, 
    FOREIGN KEY (ID) REFERENCES ACCOUNT(ID) ON DELETE CASCADE
);

------------------------------------------------------
-- TABLE 5: CARE_PARTNER 
------------------------------------------------------
CREATE TABLE CARE_PARTNER (
    ID INT PRIMARY KEY, 
    PartnerStatus BIT NOT NULL DEFAULT 1, 
    PartnerType NVARCHAR(100), 
    OrganizationName NVARCHAR(255), 
    FOREIGN KEY (ID) REFERENCES ACCOUNT(ID) ON DELETE CASCADE
);

------------------------------------------------------
-- TABLE 6: CCTV 
------------------------------------------------------
CREATE TABLE CCTV (
    ID INT IDENTITY(1,1) PRIMARY KEY, 
    Name NVARCHAR(255),
    Status NVARCHAR(50), 
    StreamUrl VARCHAR(MAX) NOT NULL, 
    IP NVARCHAR(50),
    Port INT,
    Latitude DECIMAL(9, 6), 
    Longitude DECIMAL(9, 6),
    CameraType NVARCHAR(100), 
    LastOnline DATETIME, 
    ID_Area INT REFERENCES AREA(ID)
);

------------------------------------------------------
-- TABLE 7: MISSING_DOCUMENT 
------------------------------------------------------
CREATE TABLE MISSING_DOCUMENT (
    ID INT IDENTITY(1,1) PRIMARY KEY, 
    FullName NVARCHAR(255) NOT NULL,
    Birthday DATE,
    Gender BIT, 
    IdentityCardNumber VARCHAR(100),
    Height NVARCHAR(20),
    Weight NVARCHAR(20), 
    IdentifyingCharacteristic NTEXT, 
    LastKnownOutfit NTEXT, 
    MedicalConditions NTEXT, 
    FacePictureUrl VARCHAR(MAX) NOT NULL, 
    MissingTime DATETIME NOT NULL,
    ReportDate DATETIME NOT NULL DEFAULT GETDATE(),
    UpdateDate DATETIME,
    CaseStatus NVARCHAR(50) NOT NULL DEFAULT 'Missing', 
    ReporterRelationship NVARCHAR(100),
    ID_MissingArea INT, 
    ID_Reporter INT,
    FOREIGN KEY (ID_Reporter) REFERENCES CARE_PARTNER(ID),
    FOREIGN KEY (ID_MissingArea) REFERENCES AREA(ID)
);

------------------------------------------------------
-- TABLE 8: MANAGE_DOCUMENT (Sửa lỗi chính tả)
------------------------------------------------------
CREATE TABLE MANAGE_DOCUMENT (
    ID_Police INT NOT NULL, 
    ID_MissingDocument INT NOT NULL,
    Description NTEXT, 
    FoundDate DATETIME,
    FoundPersonPicture VARCHAR(MAX),
    ConfirmTime DATETIME,
    UpdateTime DATETIME,
    Find_Place NVARCHAR(MAX),
    ConfirmationMethod NVARCHAR(255), 
    ID_FoundVolunteer INT,
    FOREIGN KEY (ID_Police) REFERENCES POLICE(ID),
    FOREIGN KEY (ID_MissingDocument) REFERENCES MISSING_DOCUMENT(ID),
    FOREIGN KEY (ID_FoundVolunteer) REFERENCES VOLUNTEER(ID),
    CONSTRAINT PK_ManageDocument PRIMARY KEY (ID_Police, ID_MissingDocument)
);

------------------------------------------------------
-- TABLE 9: VOLUNTEER_SUBSCRIPTION 
-- Bảng này ghi lại việc Tình nguyện viên "đăng ký" theo dõi một trường hợp
------------------------------------------------------
CREATE TABLE VOLUNTEER_SUBSCRIPTION (
    ID_MissingDocument INT  NOT NULL,
    ID_Volunteer INT NOT NULL,
    SubscribedDate DATETIME NOT NULL DEFAULT GETDATE(), -- Ngày bắt đầu theo dõi
    IsActive BIT NOT NULL DEFAULT 1, -- Còn theo dõi hay không
    FOREIGN KEY (ID_MissingDocument) REFERENCES MISSING_DOCUMENT(ID),
    FOREIGN KEY (ID_Volunteer) REFERENCES VOLUNTEER(ID),
    CONSTRAINT PK_VolunteerSubscription PRIMARY KEY (ID_MissingDocument, ID_Volunteer)
);

------------------------------------------------------
-- TABLE 10: CCTV_REPORT 
------------------------------------------------------
CREATE TABLE CCTV_REPORT (
    ID INT IDENTITY(1,1) PRIMARY KEY, 
    ID_CCTV INT,
    ID_MissingDocument INT, 
    Detail NVARCHAR(MAX),
    TimeReport DATETIME NOT NULL, 
    ConfirmationStatus NVARCHAR(50) NOT NULL DEFAULT 'Pending_Review', -- 'Pending_Review', 'Confirmed_Match', 'False_Alarm'
    Confident FLOAT, 
    DetectionLog NVARCHAR(255),
    DetectPicture VARCHAR(MAX), 
    ID_PoliceReviewer INT,
    ReviewTime DATETIME, 
    ReviewNotes NTEXT, 
    FOREIGN KEY (ID_CCTV) REFERENCES CCTV(ID),
    FOREIGN KEY (ID_MissingDocument) REFERENCES MISSING_DOCUMENT(ID),
    FOREIGN KEY (ID_PoliceReviewer) REFERENCES POLICE(ID),
);

------------------------------------------------------
-- TABLE 11: VOLUNTEER_REPORT
------------------------------------------------------
CREATE TABLE VOLUNTEER_REPORT (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    ID_MissingDocument INT NOT NULL,
    ID_Volunteer INT NOT NULL,
    ReportTime DATETIME NOT NULL DEFAULT GETDATE(),
    SightingPicture VARCHAR(MAX),
    SightingAreaID INT,
    Latitude DECIMAL(9, 6), 
    Longitude DECIMAL(9, 6),
    Description NTEXT,
    ReportStatus NVARCHAR(50) NOT NULL DEFAULT 'Submitted', 
    FOREIGN KEY (ID_MissingDocument) REFERENCES MISSING_DOCUMENT(ID),
    FOREIGN KEY (ID_Volunteer) REFERENCES VOLUNTEER(ID),
    FOREIGN KEY (SightingAreaID) REFERENCES AREA(ID)
);

------------------------------------------------------
-- TABLE 12: DETAIL_AREA_ACCOUNT 
------------------------------------------------------
CREATE TABLE DETAIL_AREA_ACCOUNT (
    ID_Area INT,
    ID_Account INT, 
    FOREIGN KEY (ID_Area) REFERENCES AREA(ID),
    FOREIGN KEY (ID_Account) REFERENCES ACCOUNT(ID),
    CONSTRAINT PK_DetailAreaAccount PRIMARY KEY (ID_Area, ID_Account) 
);

------------------------------------------------------
-- INSERT SAMPLE DATA
------------------------------------------------------
SET DATEFORMAT ymd;
-- Dữ liệu mẫu được thêm vào ngày 2025-10-20

------------------------------------------------------
-- TABLE 1: ACCOUNT (Đã cập nhật)
------------------------------------------------------
INSERT INTO ACCOUNT (Username, Password, Email, FullName, Birthday, Address, Gender, Phone, AccountType, AccountStatus) VALUES
('police_trung', 'hashed_pass_p1', 'trung.police@gov.vn', N'Nguyễn Văn Trung', '1985-05-10', N'123 Võ Văn Tần, Q3, TP.HCM', 0, '0901234567', 'Police', 1),   -- ID 1
('partner_lien', 'hashed_pass_c2', 'lien.care@mail.com', N'Trần Thị Liên', '1990-02-15', N'456 Lý Thường Kiệt, Q10, TP.HCM', 1, '0907654321', 'CarePartner', 1),     -- ID 2
('volun_minh', 'hashed_pass_v3', 'minh.volun@mail.com', N'Lê Quang Minh', '1995-11-30', N'789 Hòa Thạch, Hà Nội', 0, '0912233445', 'Volunteer', 1),      -- ID 3
('admin_cctv', 'hashed_admin_pass', 'admin@cctv.com', N'Quản trị viên', NULL, NULL, NULL, NULL, 'Admin', 1);             -- ID 4

------------------------------------------------------
-- TABLE 2: AREA (Đã cập nhật)
------------------------------------------------------
INSERT INTO AREA (Commune, District, Province, Country, Latitude, Longitude, Description) VALUES
(N'Phường Bến Nghé', N'Quận 1', N'TP. Hồ Chí Minh', N'Việt Nam', 10.7769, 106.7009, N'Khu vực trung tâm, gần chợ Bến Thành'),     -- ID 1
(N'Xã Hòa Thạch', N'Quốc Oai', N'Hà Nội', N'Việt Nam', 20.9710, 105.5820, N'Khu vực ngoại thành, có trạm xe buýt'),                  -- ID 2
(N'Thị trấn Liên Nghĩa', N'Đức Trọng', N'Lâm Đồng', N'Việt Nam', 11.7580, 108.3845, N'Gần sân bay Liên Khương');         -- ID 3

------------------------------------------------------
-- TABLE 3, 4, 5: POLICE, VOLUNTEER, CARE_PARTNER (Đã cập nhật)
------------------------------------------------------
-- POLICE (ID = 1)
INSERT INTO POLICE (ID, PoliceCode, Rank, Station, Patrol_Car_number) VALUES
(1, 'P-HCM-007', N'Đại úy', N'Công an Quận 1', 'HCM-PC-001');

-- CARE_PARTNER (ID = 2)
INSERT INTO CARE_PARTNER (ID, PartnerStatus, PartnerType, OrganizationName) VALUES
(2, 1, 'Family', NULL); -- Trạng thái Hoạt động, là người nhà

-- VOLUNTEER (ID = 3)
INSERT INTO VOLUNTEER (ID, VolunteerStatus, DateJoined, Skills, Rating) VALUES
(3, 1, '2024-05-01', N'Phân tích video, Tìm kiếm ngoài trời, Sơ cứu', 4.5);

------------------------------------------------------
-- TABLE 6: CCTV 
------------------------------------------------------
INSERT INTO CCTV (Name, Status, StreamUrl, IP, Port, Latitude, Longitude, CameraType, ID_Area) VALUES
(N'Camera Ngã 5 P. Bến Nghé', 'Online', 'rtsp://192.168.1.100/stream1', '192.168.1.100', 554, 10.7770, 106.7010, 'PTZ', 1), -- ID 1
(N'Camera Trạm Xe Buýt X. Hòa Thạch', 'Online', 'rtsp://192.168.1.101/stream1', '192.168.1.101', 554, 20.9712, 105.5822, 'Fixed', 2); -- ID 2

------------------------------------------------------
-- TABLE 7: MISSING_DOCUMENT 
------------------------------------------------------
INSERT INTO MISSING_DOCUMENT (FullName, Birthday, Gender, IdentityCardNumber, Height, Weight, IdentifyingCharacteristic, LastKnownOutfit, MedicalConditions, FacePictureUrl, MissingTime, ReportDate, UpdateDate, CaseStatus, ReporterRelationship, ID_MissingArea, ID_Reporter) VALUES
(N'Trần Thị Mai', '1960-08-20', 1, '123456789', N'1m50', N'48kg', N'Có nốt ruồi dưới mắt phải, tóc bạc', N'Áo bà ba màu tím, quần đen, đội nón lá', N'Alzheimer giai đoạn đầu, hay quên đường', 'url_hinh_mai.jpg', '2025-10-19 09:30:00', GETDATE(), GETDATE(), 'Missing', N'Mẹ', 1, 2); 
-- ID 1: Hồ sơ mất tích của cô Mai.

------------------------------------------------------
-- TABLE 12: DETAIL_AREA_ACCOUNT
------------------------------------------------------
INSERT INTO DETAIL_AREA_ACCOUNT (ID_Area, ID_Account) VALUES
(1, 1), -- Police Trung (ID 1) phụ trách Khu vực 1
(2, 3); -- Volunteer Minh (ID 3) theo dõi Khu vực 2

------------------------------------------------------
-- TABLE 9: VOLUNTEER_SUBSCRIPTION 
------------------------------------------------------
-- Volunteer Minh (ID 3) đăng ký theo dõi hồ sơ mất tích ID 1
INSERT INTO VOLUNTEER_SUBSCRIPTION (ID_MissingDocument, ID_Volunteer, SubscribedDate, IsActive) VALUES
(1, 3, GETDATE(), 1);

------------------------------------------------------
-- TABLE 10: CCTV_REPORT 
------------------------------------------------------
-- CCTV 1 phát hiện người mất tích ID 1, đang chờ cảnh sát xem
INSERT INTO CCTV_REPORT (ID_CCTV, ID_MissingDocument, Detail, TimeReport, ConfirmationStatus, Confident, DetectionLog, DetectPicture) VALUES
(1, 1, N'AI phát hiện khuôn mặt tương đồng 92% với Trần Thị Mai.', '2025-10-19 10:05:00', 'Pending_Review', 0.92, 'DET-CCTV1-20251019-01', 'url_hinh_phat_hien_1.jpg');

------------------------------------------------------
-- TABLE 8: MANAGE_DOCUMENT
------------------------------------------------------
-- Cảnh sát Trung (ID 1) tiếp nhận hồ sơ ID 1 và ghi nhận đã tìm thấy nhờ Volunteer Minh (ID 3)
INSERT INTO MANAGE_DOCUMENT (ID_Police, ID_MissingDocument, Description, FoundDate, FoundPersonPicture, ConfirmTime, UpdateTime, Find_Place, ConfirmationMethod, ID_FoundVolunteer) VALUES
(1, 1, N'Hồ sơ đã được đóng. Người mất tích Trần Thị Mai đã được tìm thấy tại Trạm Xe Buýt Hòa Thạch, HN.', '2025-10-20 12:00:00', 'url_hinh_tim_thay_mai.jpg', '2025-10-20 13:00:00', GETDATE(), N'Trạm Xe Buýt Xã Hòa Thạch, Hà Nội', N'Người nhà (con gái) xác nhận qua hình ảnh.', 3);

-- Cập nhật trạng thái người mất tích thành Đã tìm thấy
UPDATE MISSING_DOCUMENT SET CaseStatus = 'Found', UpdateDate = GETDATE() WHERE ID = 1;