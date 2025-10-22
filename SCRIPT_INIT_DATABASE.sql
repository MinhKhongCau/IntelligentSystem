-- -- SQL Server DDL (Data Definition Language)
-- CREATE DATABASE IntelligentSystemDB;

-- GO
-- USE IntelligentSystemDB;
-- GO


-- ------------------------------------------------------
-- -- TABLE 1: ACCOUNT
-- ------------------------------------------------------
-- CREATE TABLE ACCOUNT (
--     ID INT IDENTITY(1,1) PRIMARY KEY,
--     Username NVARCHAR(255) NOT NULL UNIQUE,
--     Password NVARCHAR(255) NOT NULL,
--     Email NVARCHAR(255) NOT NULL UNIQUE,
--     Gender BIT, -- 0: Male, 1:Female
--     Phone VARCHAR(20)
-- );

-- ------------------------------------------------------
-- -- TABLE 2: AREA
-- ------------------------------------------------------
-- CREATE TABLE AREA (
--     ID INT IDENTITY(1,1) PRIMARY KEY,
--     Commune NVARCHAR(100) NOT NULL,
--     Province NVARCHAR(100),
--     Country NVARCHAR(100)
-- );

-- ------------------------------------------------------
-- -- TABLE 3: POLICE
-- ------------------------------------------------------
-- CREATE TABLE POLICE (
--     ID INT PRIMARY KEY,
--     Patrol_Car_number NVARCHAR(255) UNIQUE
-- );

-- ------------------------------------------------------
-- -- TABLE 4: VOLUNTEER
-- ------------------------------------------------------
-- CREATE TABLE VOLUNTEER (
--     ID INT PRIMARY KEY,
--     VolunteerStatus BIT,
--     DateJoined DATE,
--     SKILL NVARCHAR(255),
--     FOREIGN KEY (ID) REFERENCES ACCOUNT(ID)
-- );

-- ------------------------------------------------------
-- -- TABLE 5: CARE_PARTNER
-- ------------------------------------------------------
-- CREATE TABLE REPORTER (
--     ID INT PRIMARY KEY,
--     PARNER_Status BIT,
--     FOREIGN KEY (ID) REFERENCES ACCOUNT(ID)
-- );

-- ------------------------------------------------------
-- -- TABLE 6: CCTV
-- ------------------------------------------------------
-- CREATE TABLE CCTV (
--     ID INT IDENTITY(1,1) PRIMARY KEY,
--     Name NVARCHAR(255),
--     Status NVARCHAR(50),
--     IP NVARCHAR(50),
--     Port INT,
--     ID_Area INT REFERENCES AREA(ID)
-- );

-- ------------------------------------------------------
-- -- TABLE 7: MISSING_DOCUMENT
-- ------------------------------------------------------
-- CREATE TABLE MISSING_DOCUMENT (
--     ID INT IDENTITY(1,1) PRIMARY KEY,
--     Name NVARCHAR(255) NOT NULL,
--     Birthday DATE,
--     Gender BIT,
--     IdentityCardNumber VARCHAR(100),
--     Height NVARCHAR(20),
--     IdentifyingCharacteristic NTEXT,
--     FacePictureUrl VARCHAR(MAX),
--     MissingTime DATETIME,
--     ReportDate DATETIME,
--     UpdateDate DATETIME,
--     Status BIT NOT NULL DEFAULT 0,
--     ID_MissingArea INT,
--     ID_Reporter INT,
--     FOREIGN KEY (ID_Reporter) REFERENCES CARE_PARTNER(ID),
--     FOREIGN KEY (ID_MissingArea) REFERENCES AREA(ID)
-- );

-- ------------------------------------------------------
-- -- TABLE 8: MANAGE_DOCUMENT
-- ------------------------------------------------------
-- CREATE TABLE MANAGE_DOCUMENT (
--     ID_Police INT NOT NULL,
--     ID_MissingDocument INT NOT NULL,
--     Descripton NVARCHAR(MAX),
--     FoundDate DATETIME,
--     FoundPersonPicture VARCHAR(MAX),
--     ConfirmTime DATETIME,
--     UpdateTime DATETIME,
--     Find_Place NVARCHAR(MAX),
--     ID_FoundVolunteer INT,
--     FOREIGN KEY (ID_Police) REFERENCES POLICE(ID),
--     FOREIGN KEY (ID_MissingDocument) REFERENCES MISSING_DOCUMENT(ID),
--     FOREIGN KEY (ID_FoundVolunteer) REFERENCES VOLUNTEER(ID),
--     CONSTRAINT PK_ManageDocument PRIMARY KEY (ID_Police, ID_MissingDocument)
-- );

-- ------------------------------------------------------
-- -- TABLE 9: INTERESTING_PROFILE
-- ------------------------------------------------------
-- CREATE TABLE INTEREST_PROFILE (
--     ID_MissingDocument INT  NOT NULL,
--     ID_Volunteer INT NOT NULL,
--     InterestingDate DATETIME,
--     FoundDate DATETIME,
--     FoundPicture VARCHAR(MAX),
--     FoundArea INT,
--     Descripton NVARCHAR(MAX),
--     FOREIGN KEY (ID_MissingDocument) REFERENCES MISSING_DOCUMENT(ID),
--     FOREIGN KEY (ID_Volunteer) REFERENCES VOLUNTEER(ID),
--     FOREIGN KEY (FoundArea) REFERENCES AREA(ID),
--     CONSTRAINT PK_InterestingProfile PRIMARY KEY (ID_MissingDocument, ID_Volunteer)
-- );

-- ------------------------------------------------------
-- -- TABLE 10: CCTV_REPORT
-- ------------------------------------------------------
-- CREATE TABLE CCTV_REPORT (
--     ID_CCTV INT,
--     ID_MissingDocument INT,
--     Detail NVARCHAR(MAX),
--     TimeReport DATETIME,
--     Status BIT,
--     Confident FLOAT,
--     DetectionLog NVARCHAR(255),
--     DetectPicture VARCHAR(MAX),
--     FOREIGN KEY (ID_CCTV) REFERENCES CCTV(ID),
--     FOREIGN KEY (ID_MissingDocument) REFERENCES MISSING_DOCUMENT(ID),
--     CONSTRAINT PK_CCTV_REPORT PRIMARY KEY (ID_CCTV, ID_MissingDocument, TimeReport)
-- );

-- ------------------------------------------------------
-- -- TABLE 12: DETAIL_AREA_ACCOUNT
-- ------------------------------------------------------
-- CREATE TABLE DETAIL_AREA_ACCOUNT (
--     ID_Area INT,
--     ID_Account INT,
--     FOREIGN KEY (ID_Area) REFERENCES AREA(ID),
--     FOREIGN KEY (ID_Account) REFERENCES ACCOUNT(ID)
-- );

-- ------------------------------------------------------
-- -- INSERT DATA
-- ------------------------------------------------------
-- SET DATEFORMAT ymd;
-- -- Dữ liệu mẫu được thêm vào ngày 2025-10-20

-- ------------------------------------------------------
-- -- TABLE 1: ACCOUNT (Sử dụng ID 1-4)
-- ------------------------------------------------------
-- INSERT INTO ACCOUNT (Username, Password, Email, Gender, Phone) VALUES
-- ('police_trung', 'pass_p1', 'trung.police@gov.vn', 0, '0901234567'),   -- ID 1: Police
-- ('partner_lien', 'pass_c2', 'lien.care@mail.com', 1, '0907654321'),     -- ID 2: Care Partner
-- ('volun_minh', 'pass_v3', 'minh.volun@mail.com', 0, '0912233445'),      -- ID 3: Volunteer
-- ('admin_cctv', 'admin_pass', 'admin@cctv.com', NULL, NULL);             -- ID 4: Admin (Không được sử dụng làm FK)

-- ------------------------------------------------------
-- -- TABLE 2: AREA (Sử dụng ID 1-3)
-- ------------------------------------------------------
-- INSERT INTO AREA (Commune, Province, Country) VALUES
-- (N'Phường Bến Nghé', N'TP. Hồ Chí Minh', N'Việt Nam'),     -- ID 1: Khu vực 1 (Mất tích)
-- (N'Xã Hòa Thạch', N'Hà Nội', N'Việt Nam'),                  -- ID 2: Khu vực 2 (Phát hiện)
-- (N'Thị trấn Liên Nghĩa', N'Lâm Đồng', N'Việt Nam');         -- ID 3: Khu vực 3

-- ------------------------------------------------------
-- -- TABLE 3, 4, 5: POLICE, VOLUNTEER, CARE_PARTNER
-- ------------------------------------------------------
-- -- POLICE (ID = 1)
-- INSERT INTO POLICE (ID, Patrol_Car_number) VALUES
-- (1, 'HCM-PC-001');

-- -- CARE_PARTNER (ID = 2)
-- INSERT INTO CARE_PARTNER (ID, PARNER_Status) VALUES
-- (2, 1); -- Trạng thái Hoạt động

-- -- VOLUNTEER (ID = 3)
-- INSERT INTO VOLUNTEER (ID, VolunteerStatus, DateJoined, SKILL) VALUES
-- (3, 1, '2024-05-01', N'Phân tích video, Tìm kiếm ngoài trời');

-- ------------------------------------------------------
-- -- TABLE 6: CCTV
-- ------------------------------------------------------
-- INSERT INTO CCTV (Name, Status, IP, Port, ID_Area) VALUES
-- (N'Camera Ngã 5 P. Bến Nghé', 'Online', '192.168.1.100', 8080, 1), -- ID 1: Tại khu vực mất tích
-- (N'Camera Trạm Xe Buýt X. Hòa Thạch', 'Online', '192.168.1.101', 8080, 2); -- ID 2: Tại khu vực phát hiện

-- ------------------------------------------------------
-- -- TABLE 7: MISSING_DOCUMENT
-- ------------------------------------------------------
-- INSERT INTO MISSING_DOCUMENT (Name, Birthday, Gender, IdentityCardNumber, Height, IdentifyingCharacteristic, FacePictureUrl, MissingTime, ReportDate, UpdateDate, Status, ID_MissingArea, ID_Reporter) VALUES
-- (N'Trần Thị Mai', '1960-08-20', 1, '123456789', N'1m50', N'Có nốt ruồi dưới mắt phải, tóc bạc', 'url_hinh_mai.jpg', '2025-10-19 09:30:00', GETDATE(), GETDATE(), 0, 1, 2);
-- -- ID 1: Hồ sơ mất tích của cô Mai. Báo cáo bởi Partner ID 2 (Lien). Mất tại Area ID 1.

-- ------------------------------------------------------
-- -- TABLE 12: DETAIL_AREA_ACCOUNT
-- ------------------------------------------------------
-- -- Police Trung (ID 1) chịu trách nhiệm theo dõi Khu vực 1
-- INSERT INTO DETAIL_AREA_ACCOUNT (ID_Area, ID_Account) VALUES
-- (1, 1),
-- (2, 3); -- Volunteer Minh (ID 3) theo dõi Khu vực 2

-- ------------------------------------------------------
-- -- TABLE 9: INTEREST_PROFILE
-- ------------------------------------------------------
-- -- Volunteer Minh (ID 3) quan tâm đến hồ sơ mất tích ID 1
-- INSERT INTO INTEREST_PROFILE (ID_MissingDocument, ID_Volunteer, InterestingDate, FoundDate, FoundPicture, FoundArea, Descripton) VALUES
-- (1, 3, GETDATE(), NULL, NULL, 2, N'Tình nguyện viên Minh bắt đầu tìm kiếm tại khu vực Hòa Thạch (Area 2).');

-- ------------------------------------------------------
-- -- TABLE 10: CCTV_REPORT
-- ------------------------------------------------------
-- -- CCTV 1 phát hiện người mất tích ID 1
-- INSERT INTO CCTV_REPORT (ID_CCTV, ID_MissingDocument, Detail, TimeReport, Status, Confident, DetectionLog, DetectPicture) VALUES
-- (1, 1, N'AI phát hiện khuôn mặt tương đồng 92% với Trần Thị Mai.', '2025-10-19 10:05:00', 0, 0.92, 'DET-CCTV1-20251019-01', 'url_hinh_phat_hien_1.jpg');

-- ------------------------------------------------------
-- -- TABLE 8: MANAGE_DOCUMENT
-- ------------------------------------------------------
-- -- Cảnh sát Trung (ID 1) tiếp nhận hồ sơ ID 1 và ghi nhận đã tìm thấy nhờ Volunteer Minh (ID 3)
-- INSERT INTO MANAGE_DOCUMENT (ID_Police, ID_MissingDocument, Descripton, FoundDate, FoundPersonPicture, ConfirmTime, UpdateTime, Find_Place, ID_FoundVolunteer) VALUES
-- (1, 1, N'Người mất tích Trần Thị Mai đã được tìm thấy tại Trạm Xe Buýt Hòa Thạch, HN. Hồ sơ đã được đóng.', '2025-10-20 12:00:00', 'url_hinh_tim_thay_mai.jpg', '2025-10-20 13:00:00', GETDATE(), N'Trạm Xe Buýt Xã Hòa Thạch, Hà Nội', 3);

-- -- Cập nhật trạng thái người mất tích thành Đã tìm thấy (Status = 1)
-- UPDATE MISSING_DOCUMENT SET Status = 1, UpdateDate = GETDATE() WHERE ID = 1;

-- databasev2
/*
================================================================================
PHẦN 1: TẠO CẤU TRÚC BẢNG (CREATE TABLE SCRIPT)
================================================================================
*/
BEGIN TRANSACTION;
GO

-- 1. Bảng Area (Khu vực)
CREATE TABLE Area (
    ID int IDENTITY(1,1) PRIMARY KEY,
    Commune nvarchar(100) NOT NULL,
    District nvarchar(100) NOT NULL,
    Province nvarchar(100) NOT NULL,
    Country nvarchar(100) NOT NULL DEFAULT 'Vietnam'
);
GO

-- 2. Bảng Account (Tài khoản)
CREATE TABLE Account (
    ID int IDENTITY(1,1) PRIMARY KEY,
    Username nvarchar(255) NOT NULL UNIQUE,
    PasswordHash nvarchar(255) NOT NULL,
    Email nvarchar(255) NOT NULL UNIQUE,
    PhoneNumber nvarchar(20) NULL,
    FullName nvarchar(255) NULL,
    Role nvarchar(50) NOT NULL,
    DateJoined datetime NOT NULL DEFAULT GETDATE(),
    Status bit NOT NULL DEFAULT 1, -- 1 = Active, 0 = Inactive
    CONSTRAINT CHK_Account_Role CHECK (Role IN ('Admin', 'Police', 'Volunteer', 'FamilyMember')),
    CONSTRAINT CHK_Account_Status CHECK (Status IN (0, 1))
);
GO

-- 3. Bảng MissingProfile (Hồ sơ mất tích)
CREATE TABLE MissingProfile (
    ID int IDENTITY(1,1) PRIMARY KEY,
    FullName nvarchar(255) NOT NULL,
    Birthdate date NULL,
    Gender bit NULL, -- 0 = Female, 1 = Male
    IdentityCardNumber nvarchar(20) NULL UNIQUE,
    Height nvarchar(20) NULL,
    IdentifyingFeatures nvarchar(max) NULL,
    ReferenceFaceImageURL nvarchar(max) NOT NULL,
    MissingTimestamp datetime NOT NULL,
    ReportedDate datetime NOT NULL DEFAULT GETDATE(),
    Status nvarchar(50) NOT NULL DEFAULT 'Missing',
    ID_Reporter int NOT NULL,
    ID_LastSeenArea int NOT NULL,
    CONSTRAINT CHK_Profile_Status CHECK (Status IN ('Missing', 'Found', 'Suspended')),
    CONSTRAINT FK_Profile_Reporter FOREIGN KEY (ID_Reporter) REFERENCES Account(ID),
    CONSTRAINT FK_Profile_Area FOREIGN KEY (ID_LastSeenArea) REFERENCES Area(ID)
);
GO

-- 4. Bảng CCTV (Camera)
CREATE TABLE CCTV (
    ID int IDENTITY(1,1) PRIMARY KEY,
    CCTV_Name nvarchar(255) NOT NULL,
    IP_Address nvarchar(50) NULL,
    Port int NULL,
    Status nvarchar(50) NOT NULL DEFAULT 'Active',
    LocationDescription nvarchar(max) NULL,
    ID_Area int NOT NULL,
    CONSTRAINT CHK_CCTV_Status CHECK (Status IN ('Active', 'Inactive', 'Maintenance')),
    CONSTRAINT FK_CCTV_Area FOREIGN KEY (ID_Area) REFERENCES Area(ID)
);
GO

-- 5. Bảng CCTVDetection (Phát hiện từ CCTV)
CREATE TABLE CCTVDetection (
    ID int IDENTITY(1,1) PRIMARY KEY,
    ID_CCTV int NOT NULL,
    DetectionTimestamp datetime NOT NULL,
    DetectedImageURL nvarchar(max) NOT NULL,
    Confidence float NULL,
    VerificationStatus nvarchar(50) NOT NULL DEFAULT 'Unverified',
    ID_MissingProfile int NULL, -- Có thể NULL nếu AI chỉ phát hiện nhưng không khớp
    CONSTRAINT CHK_Detection_Status CHECK (VerificationStatus IN ('Unverified', 'Verified', 'FalseAlarm')),
    CONSTRAINT FK_Detection_CCTV FOREIGN KEY (ID_CCTV) REFERENCES CCTV(ID),
    CONSTRAINT FK_Detection_Profile FOREIGN KEY (ID_MissingProfile) REFERENCES MissingProfile(ID)
);
GO

-- 6. Bảng SightingReport (Báo cáo từ tình nguyện viên)
CREATE TABLE SightingReport (
    ID int IDENTITY(1,1) PRIMARY KEY,
    ID_Reporter int NOT NULL,
    SightingTimestamp datetime NOT NULL,
    CapturedImageURL nvarchar(max) NULL,
    Description nvarchar(max) NOT NULL,
    VerificationStatus nvarchar(50) NOT NULL DEFAULT 'Unverified',
    ID_SightingArea int NOT NULL,
    ID_MissingProfile int NULL, -- Có thể NULL nếu TNV báo cáo 1 người lạ
    CONSTRAINT CHK_Sighting_Status CHECK (VerificationStatus IN ('Unverified', 'Verified', 'FalseAlarm')),
    CONSTRAINT FK_Sighting_Reporter FOREIGN KEY (ID_Reporter) REFERENCES Account(ID),
    CONSTRAINT FK_Sighting_Area FOREIGN KEY (ID_SightingArea) REFERENCES Area(ID),
    CONSTRAINT FK_Sighting_Profile FOREIGN KEY (ID_MissingProfile) REFERENCES MissingProfile(ID)
);
GO

-- 7. Bảng CaseAssignment (Phân công vụ việc) - Bảng trung gian
CREATE TABLE CaseAssignment (
    ID_Account int NOT NULL,
    ID_MissingProfile int NOT NULL,
    AssignmentDate datetime NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (ID_Account, ID_MissingProfile), -- Khóa chính tổng hợp
    CONSTRAINT FK_Assign_Account FOREIGN KEY (ID_Account) REFERENCES Account(ID),
    CONSTRAINT FK_Assign_Profile FOREIGN KEY (ID_MissingProfile) REFERENCES MissingProfile(ID)
);
GO

-- 8. Bảng Account_Area (Khu vực hoạt động của tài khoản) - Bảng trung gian
CREATE TABLE Account_Area (
    ID_Account int NOT NULL,
    ID_Area int NOT NULL,
    PRIMARY KEY (ID_Account, ID_Area), -- Khóa chính tổng hợp
    CONSTRAINT FK_AccountArea_Account FOREIGN KEY (ID_Account) REFERENCES Account(ID),
    CONSTRAINT FK_AccountArea_Area FOREIGN KEY (ID_Area) REFERENCES Area(ID)
);
GO

COMMIT TRANSACTION;
GO

/*
================================================================================
PHẦN 2: CHÈN DỮ LIỆU MẪU (MOCK DATA SCRIPT)
================================================================================
*/
BEGIN TRANSACTION;
GO

-- Bật IDENTITY_INSERT để chúng ta có thể gán ID cụ thể cho dữ liệu mẫu
-- Việc này giúp dễ dàng tham chiếu ID ở các bảng sau

-- 1. Chèn dữ liệu cho 'Area'
SET IDENTITY_INSERT Area ON;
INSERT INTO Area (ID, Commune, District, Province, Country)
VALUES
(1, N'Phường Bến Nghé', N'Quận 1', N'Hồ Chí Minh', 'Vietnam'),
(2, N'Phường Hàng Trống', N'Quận Hoàn Kiếm', N'Hà Nội', 'Vietnam'),
(3, N'Phường Hải Châu 1', N'Quận Hải Châu', N'Đà Nẵng', 'Vietnam');
SET IDENTITY_INSERT Area OFF;
GO

-- 2. Chèn dữ liệu cho 'Account'
-- Mật khẩu nên được hash bằng một thuật toán (vd: bcrypt),
-- ở đây dùng 'hashed_password_placeholder' để minh họa
SET IDENTITY_INSERT Account ON;
INSERT INTO Account (ID, Username, PasswordHash, Email, PhoneNumber, FullName, Role, Status)
VALUES
(1, 'admin', 'hashed_password_placeholder', 'admin@example.com', '0123456789', N'Quản Trị Viên', 'Admin', 1),
(2, 'police_officer_1', 'hashed_password_placeholder', 'police1@example.com', '0987654321', N'Nguyễn Văn Công', 'Police', 1),
(3, 'volunteer_anna', 'hashed_password_placeholder', 'anna@example.com', '0111222333', N'Trần Thị Anna', 'Volunteer', 1),
(4, 'family_tran', 'hashed_password_placeholder', 'family.tran@example.com', '0444555666', N'Trần Văn B', 'FamilyMember', 1);
SET IDENTITY_INSERT Account OFF;
GO

-- 3. Chèn dữ liệu cho 'MissingProfile'
SET IDENTITY_INSERT MissingProfile ON;
INSERT INTO MissingProfile (ID, FullName, Birthdate, Gender, IdentityCardNumber, Height, IdentifyingFeatures, ReferenceFaceImageURL, MissingTimestamp, Status, ID_Reporter, ID_LastSeenArea)
VALUES
(1, N'Nguyễn Văn An', '1990-05-15', 1, '001234567890', '170cm', N'Nốt ruồi bên má trái, mặc áo sơ mi xanh và quần jean.', 'http://example.com/images/an_nguyen.jpg', '2025-10-20 08:00:00', 'Missing', 4, 1),
(2, N'Lê Thị Bình', '2005-01-20', 0, '001234567891', '155cm', N'Tóc dài, đeo balo màu hồng.', 'http://example.com/images/binh_le.jpg', '2025-10-15 17:30:00', 'Missing', 4, 2),
(3, N'Phạm Hùng', '1985-11-30', 1, '001234567892', '175cm', N'Sẹo nhỏ ở cằm.', 'http://example.com/images/hung_pham.jpg', '2025-09-01 12:00:00', 'Found', 4, 3);
SET IDENTITY_INSERT MissingProfile OFF;
GO

-- 4. Chèn dữ liệu cho 'CCTV'
SET IDENTITY_INSERT CCTV ON;
INSERT INTO CCTV (ID, CCTV_Name, IP_Address, Port, Status, LocationDescription, ID_Area)
VALUES
(1, 'CCTV_BenThanh_Corner1', '192.168.1.101', 80, 'Active', N'Góc chợ Bến Thành (Quận 1)', 1),
(2, 'CCTV_HoGuom_Main', '192.168.2.102', 80, 'Active', N'Lối vào chính Hồ Gươm (Hoàn Kiếm)', 2),
(3, 'CCTV_NguyenVanLinh_DaNang', '192.168.3.103', 8080, 'Maintenance', N'Ngã tư Nguyễn Văn Linh - Cầu Rồng (Đà Nẵng)', 3);
SET IDENTITY_INSERT CCTV OFF;
GO

-- 5. Chèn dữ liệu cho 'CCTVDetection'
SET IDENTITY_INSERT CCTVDetection ON;
INSERT INTO CCTVDetection (ID, ID_CCTV, DetectionTimestamp, DetectedImageURL, Confidence, VerificationStatus, ID_MissingProfile)
VALUES
(1, 1, '2025-10-20 08:30:15', 'http://example.com/detections/detect_1.jpg', 0.92, 'Unverified', 1), -- Phát hiện 'Nguyễn Văn An'
(2, 2, '2025-10-15 18:00:05', 'http://example.com/detections/detect_2.jpg', 0.75, 'Verified', 2), -- Phát hiện 'Lê Thị Bình', đã xác minh
(3, 1, '2025-10-21 09:15:00', 'http://example.com/detections/detect_3.jpg', 0.88, 'FalseAlarm', 1); -- Báo động giả cho 'Nguyễn Văn An'
SET IDENTITY_INSERT CCTVDetection OFF;
GO

-- 6. Chèn dữ liệu cho 'SightingReport'
SET IDENTITY_INSERT SightingReport ON;
INSERT INTO SightingReport (ID, ID_Reporter, SightingTimestamp, CapturedImageURL, Description, VerificationStatus, ID_SightingArea, ID_MissingProfile)
VALUES
(1, 3, '2025-10-20 10:00:00', 'http://example.com/sightings/sighting_1.jpg', N'Tôi thấy một người giống mô tả ở công viên 23/9. Anh ta có vẻ bối rối.', 'Unverified', 1, 1), -- TNV báo cáo thấy 'Nguyễn Văn An'
(2, 3, '2025-10-16 07:00:00', NULL, N'Một cô gái đeo balo hồng giống mô tả đang đi bộ gần Phố Cổ.', 'Unverified', 2, 2); -- TNV báo cáo thấy 'Lê Thị Bình'
SET IDENTITY_INSERT SightingReport OFF;
GO

-- 7. Chèn dữ liệu cho 'CaseAssignment' (Không cần SET IDENTITY_INSERT)
INSERT INTO CaseAssignment (ID_Account, ID_MissingProfile, AssignmentDate)
VALUES
(2, 1, '2025-10-20 10:00:00'), -- Cảnh sát 1 được gán vụ 'Nguyễn Văn An'
(2, 2, '2025-10-16 09:00:00'); -- Cảnh sát 1 cũng được gán vụ 'Lê Thị Bình'
GO

-- 8. Chèn dữ liệu cho 'Account_Area' (Không cần SET IDENTITY_INSERT)
INSERT INTO Account_Area (ID_Account, ID_Area)
VALUES
(2, 1), -- Cảnh sát 1 hoạt động ở Quận 1
(3, 1), -- Tình nguyện viên Anna hoạt động ở Quận 1
(3, 2); -- Tình nguyện viên Anna cũng hoạt động ở Hoàn Kiếm
GO

COMMIT TRANSACTION;
GO

PRINT 'Tạo cơ sở dữ liệu và chèn dữ liệu mẫu thành công!';