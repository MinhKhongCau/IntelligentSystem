USE [IntelligentSystemDB]
GO
/****** Object:  Table [dbo].[ACCOUNT]    Script Date: 10/22/2025 7:03:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ACCOUNT](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](255) NOT NULL,
	[Password] [nvarchar](255) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[FullName] [nvarchar](255) NULL,
	[Birthday] [date] NULL,
	[Address] [nvarchar](max) NULL,
	[Gender] [bit] NULL,
	[Phone] [varchar](20) NULL,
	[ProfilePictureUrl] [varchar](max) NULL,
	[AccountType] [nvarchar](50) NOT NULL,
	[AccountStatus] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AREA]    Script Date: 10/22/2025 7:03:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AREA](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Commune] [nvarchar](100) NULL,
	[District] [nvarchar](100) NULL,
	[Province] [nvarchar](100) NOT NULL,
	[Country] [nvarchar](100) NOT NULL,
	[Latitude] [decimal](9, 6) NULL,
	[Longitude] [decimal](9, 6) NULL,
	[Description] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CARE_PARTNER]    Script Date: 10/22/2025 7:03:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CARE_PARTNER](
	[ID] [int] NOT NULL,
	[PartnerStatus] [bit] NOT NULL,
	[PartnerType] [nvarchar](100) NULL,
	[OrganizationName] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CCTV]    Script Date: 10/22/2025 7:03:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CCTV](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NULL,
	[Status] [nvarchar](50) NULL,
	[StreamUrl] [varchar](max) NOT NULL,
	[IP] [nvarchar](50) NULL,
	[Port] [int] NULL,
	[Latitude] [decimal](9, 6) NULL,
	[Longitude] [decimal](9, 6) NULL,
	[CameraType] [nvarchar](100) NULL,
	[LastOnline] [datetime] NULL,
	[ID_Area] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CCTV_REPORT]    Script Date: 10/22/2025 7:03:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CCTV_REPORT](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ID_CCTV] [int] NULL,
	[ID_MissingDocument] [int] NULL,
	[Detail] [nvarchar](max) NULL,
	[TimeReport] [datetime] NOT NULL,
	[ConfirmationStatus] [nvarchar](50) NOT NULL,
	[Confident] [float] NULL,
	[DetectionLog] [nvarchar](255) NULL,
	[DetectPicture] [varchar](max) NULL,
	[ID_PoliceReviewer] [int] NULL,
	[ReviewTime] [datetime] NULL,
	[ReviewNotes] [ntext] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DETAIL_AREA_ACCOUNT]    Script Date: 10/22/2025 7:03:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DETAIL_AREA_ACCOUNT](
	[ID_Area] [int] NOT NULL,
	[ID_Account] [int] NOT NULL,
 CONSTRAINT [PK_DetailAreaAccount] PRIMARY KEY CLUSTERED 
(
	[ID_Area] ASC,
	[ID_Account] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MANAGE_DOCUMENT]    Script Date: 10/22/2025 7:03:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MANAGE_DOCUMENT](
	[ID_Police] [int] NOT NULL,
	[ID_MissingDocument] [int] NOT NULL,
	[Description] [ntext] NULL,
	[FoundDate] [datetime] NULL,
	[FoundPersonPicture] [varchar](max) NULL,
	[ConfirmTime] [datetime] NULL,
	[UpdateTime] [datetime] NULL,
	[Find_Place] [nvarchar](max) NULL,
	[ConfirmationMethod] [nvarchar](255) NULL,
	[ID_FoundVolunteer] [int] NULL,
 CONSTRAINT [PK_ManageDocument] PRIMARY KEY CLUSTERED 
(
	[ID_Police] ASC,
	[ID_MissingDocument] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MISSING_DOCUMENT]    Script Date: 10/22/2025 7:03:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MISSING_DOCUMENT](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](255) NOT NULL,
	[Birthday] [date] NULL,
	[Gender] [bit] NULL,
	[IdentityCardNumber] [varchar](100) NULL,
	[Height] [nvarchar](20) NULL,
	[Weight] [nvarchar](20) NULL,
	[IdentifyingCharacteristic] [ntext] NULL,
	[LastKnownOutfit] [ntext] NULL,
	[MedicalConditions] [ntext] NULL,
	[FacePictureUrl] [varchar](max) NOT NULL,
	[MissingTime] [datetime] NOT NULL,
	[ReportDate] [datetime] NOT NULL,
	[UpdateDate] [datetime] NULL,
	[CaseStatus] [nvarchar](50) NOT NULL,
	[ReporterRelationship] [nvarchar](100) NULL,
	[ID_MissingArea] [int] NULL,
	[ID_Reporter] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[POLICE]    Script Date: 10/22/2025 7:03:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[POLICE](
	[ID] [int] NOT NULL,
	[PoliceCode] [nvarchar](50) NULL,
	[Rank] [nvarchar](100) NULL,
	[Station] [nvarchar](255) NULL,
	[Patrol_Car_number] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VOLUNTEER]    Script Date: 10/22/2025 7:03:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VOLUNTEER](
	[ID] [int] NOT NULL,
	[VolunteerStatus] [bit] NOT NULL,
	[DateJoined] [date] NULL,
	[Skills] [ntext] NULL,
	[Rating] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VOLUNTEER_REPORT]    Script Date: 10/22/2025 7:03:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VOLUNTEER_REPORT](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ID_MissingDocument] [int] NOT NULL,
	[ID_Volunteer] [int] NOT NULL,
	[ReportTime] [datetime] NOT NULL,
	[SightingPicture] [varchar](max) NULL,
	[SightingAreaID] [int] NULL,
	[Latitude] [decimal](9, 6) NULL,
	[Longitude] [decimal](9, 6) NULL,
	[Description] [ntext] NULL,
	[ReportStatus] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VOLUNTEER_SUBSCRIPTION]    Script Date: 10/22/2025 7:03:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VOLUNTEER_SUBSCRIPTION](
	[ID_MissingDocument] [int] NOT NULL,
	[ID_Volunteer] [int] NOT NULL,
	[SubscribedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_VolunteerSubscription] PRIMARY KEY CLUSTERED 
(
	[ID_MissingDocument] ASC,
	[ID_Volunteer] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[ACCOUNT] ON 

INSERT [dbo].[ACCOUNT] ([ID], [Username], [Password], [Email], [FullName], [Birthday], [Address], [Gender], [Phone], [ProfilePictureUrl], [AccountType], [AccountStatus], [CreatedAt]) VALUES (1, N'police_trung', N'hashed_pass_p1', N'trung.police@gov.vn', N'Nguyễn Văn Trung', CAST(N'1985-05-10' AS Date), N'123 Võ Văn Tần, Q3, TP.HCM', 0, N'0901234567', NULL, N'Police', 1, CAST(N'2025-10-21T14:58:34.643' AS DateTime))
INSERT [dbo].[ACCOUNT] ([ID], [Username], [Password], [Email], [FullName], [Birthday], [Address], [Gender], [Phone], [ProfilePictureUrl], [AccountType], [AccountStatus], [CreatedAt]) VALUES (2, N'partner_lien', N'hashed_pass_c2', N'lien.care@mail.com', N'Trần Thị Liên', CAST(N'1990-02-15' AS Date), N'456 Lý Thường Kiệt, Q10, TP.HCM', 1, N'0907654321', NULL, N'CarePartner', 1, CAST(N'2025-10-21T14:58:34.643' AS DateTime))
INSERT [dbo].[ACCOUNT] ([ID], [Username], [Password], [Email], [FullName], [Birthday], [Address], [Gender], [Phone], [ProfilePictureUrl], [AccountType], [AccountStatus], [CreatedAt]) VALUES (3, N'volun_minh', N'hashed_pass_v3', N'minh.volun@mail.com', N'Lê Quang Minh', CAST(N'1995-11-30' AS Date), N'789 Hòa Thạch, Hà Nội', 0, N'0912233445', NULL, N'Volunteer', 1, CAST(N'2025-10-21T14:58:34.643' AS DateTime))
INSERT [dbo].[ACCOUNT] ([ID], [Username], [Password], [Email], [FullName], [Birthday], [Address], [Gender], [Phone], [ProfilePictureUrl], [AccountType], [AccountStatus], [CreatedAt]) VALUES (4, N'admin_cctv', N'hashed_admin_pass', N'admin@cctv.com', N'Quản trị viên', NULL, NULL, NULL, NULL, NULL, N'Admin', 1, CAST(N'2025-10-21T14:58:34.643' AS DateTime))
SET IDENTITY_INSERT [dbo].[ACCOUNT] OFF
GO
SET IDENTITY_INSERT [dbo].[AREA] ON 

INSERT [dbo].[AREA] ([ID], [Commune], [District], [Province], [Country], [Latitude], [Longitude], [Description]) VALUES (1, N'Phường Bến Nghé', N'Quận 1', N'TP. Hồ Chí Minh', N'Việt Nam', CAST(10.776900 AS Decimal(9, 6)), CAST(106.700900 AS Decimal(9, 6)), N'Khu vực trung tâm, gần chợ Bến Thành')
INSERT [dbo].[AREA] ([ID], [Commune], [District], [Province], [Country], [Latitude], [Longitude], [Description]) VALUES (2, N'Xã Hòa Thạch', N'Quốc Oai', N'Hà Nội', N'Việt Nam', CAST(20.971000 AS Decimal(9, 6)), CAST(105.582000 AS Decimal(9, 6)), N'Khu vực ngoại thành, có trạm xe buýt')
INSERT [dbo].[AREA] ([ID], [Commune], [District], [Province], [Country], [Latitude], [Longitude], [Description]) VALUES (3, N'Thị trấn Liên Nghĩa', N'Đức Trọng', N'Lâm Đồng', N'Việt Nam', CAST(11.758000 AS Decimal(9, 6)), CAST(108.384500 AS Decimal(9, 6)), N'Gần sân bay Liên Khương')
SET IDENTITY_INSERT [dbo].[AREA] OFF
GO
INSERT [dbo].[CARE_PARTNER] ([ID], [PartnerStatus], [PartnerType], [OrganizationName]) VALUES (2, 1, N'Family', NULL)
GO
SET IDENTITY_INSERT [dbo].[CCTV] ON 

INSERT [dbo].[CCTV] ([ID], [Name], [Status], [StreamUrl], [IP], [Port], [Latitude], [Longitude], [CameraType], [LastOnline], [ID_Area]) VALUES (1, N'Camera Ngã 5 P. Bến Nghé', N'Online', N'rtsp://192.168.1.100/stream1', N'192.168.1.100', 554, CAST(10.777000 AS Decimal(9, 6)), CAST(106.701000 AS Decimal(9, 6)), N'PTZ', NULL, 1)
INSERT [dbo].[CCTV] ([ID], [Name], [Status], [StreamUrl], [IP], [Port], [Latitude], [Longitude], [CameraType], [LastOnline], [ID_Area]) VALUES (2, N'Camera Trạm Xe Buýt X. Hòa Thạch', N'Online', N'rtsp://192.168.1.101/stream1', N'192.168.1.101', 554, CAST(20.971200 AS Decimal(9, 6)), CAST(105.582200 AS Decimal(9, 6)), N'Fixed', NULL, 2)
SET IDENTITY_INSERT [dbo].[CCTV] OFF
GO
SET IDENTITY_INSERT [dbo].[CCTV_REPORT] ON 

INSERT [dbo].[CCTV_REPORT] ([ID], [ID_CCTV], [ID_MissingDocument], [Detail], [TimeReport], [ConfirmationStatus], [Confident], [DetectionLog], [DetectPicture], [ID_PoliceReviewer], [ReviewTime], [ReviewNotes]) VALUES (1, 1, 1, N'AI phát hiện khuôn mặt tương đồng 92% với Trần Thị Mai.', CAST(N'2025-10-19T10:05:00.000' AS DateTime), N'Pending_Review', 0.92, N'DET-CCTV1-20251019-01', N'url_hinh_phat_hien_1.jpg', NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[CCTV_REPORT] OFF
GO
INSERT [dbo].[DETAIL_AREA_ACCOUNT] ([ID_Area], [ID_Account]) VALUES (1, 1)
INSERT [dbo].[DETAIL_AREA_ACCOUNT] ([ID_Area], [ID_Account]) VALUES (2, 3)
GO
INSERT [dbo].[MANAGE_DOCUMENT] ([ID_Police], [ID_MissingDocument], [Description], [FoundDate], [FoundPersonPicture], [ConfirmTime], [UpdateTime], [Find_Place], [ConfirmationMethod], [ID_FoundVolunteer]) VALUES (1, 1, N'Hồ sơ đã được đóng. Người mất tích Trần Thị Mai đã được tìm thấy tại Trạm Xe Buýt Hòa Thạch, HN.', CAST(N'2025-10-20T12:00:00.000' AS DateTime), N'url_hinh_tim_thay_mai.jpg', CAST(N'2025-10-20T13:00:00.000' AS DateTime), CAST(N'2025-10-21T14:58:34.700' AS DateTime), N'Trạm Xe Buýt Xã Hòa Thạch, Hà Nội', N'Người nhà (con gái) xác nhận qua hình ảnh.', 3)
GO
SET IDENTITY_INSERT [dbo].[MISSING_DOCUMENT] ON 

INSERT [dbo].[MISSING_DOCUMENT] ([ID], [FullName], [Birthday], [Gender], [IdentityCardNumber], [Height], [Weight], [IdentifyingCharacteristic], [LastKnownOutfit], [MedicalConditions], [FacePictureUrl], [MissingTime], [ReportDate], [UpdateDate], [CaseStatus], [ReporterRelationship], [ID_MissingArea], [ID_Reporter]) VALUES (1, N'Trần Thị Mai', CAST(N'1960-08-20' AS Date), 1, N'123456789', N'1m50', N'48kg', N'Có nốt ruồi dưới mắt phải, tóc bạc', N'Áo bà ba màu tím, quần đen, đội nón lá', N'Alzheimer giai đoạn đầu, hay quên đường', N'url_hinh_mai.jpg', CAST(N'2025-10-19T09:30:00.000' AS DateTime), CAST(N'2025-10-21T14:58:34.673' AS DateTime), CAST(N'2025-10-21T14:58:34.703' AS DateTime), N'Found', N'Mẹ', 1, 2)
SET IDENTITY_INSERT [dbo].[MISSING_DOCUMENT] OFF
GO
INSERT [dbo].[POLICE] ([ID], [PoliceCode], [Rank], [Station], [Patrol_Car_number]) VALUES (1, N'P-HCM-007', N'Đại úy', N'Công an Quận 1', N'HCM-PC-001')
GO
INSERT [dbo].[VOLUNTEER] ([ID], [VolunteerStatus], [DateJoined], [Skills], [Rating]) VALUES (3, 1, CAST(N'2024-05-01' AS Date), N'Phân tích video, Tìm kiếm ngoài trời, Sơ cứu', 4.5)
GO
INSERT [dbo].[VOLUNTEER_SUBSCRIPTION] ([ID_MissingDocument], [ID_Volunteer], [SubscribedDate], [IsActive]) VALUES (1, 3, CAST(N'2025-10-21T14:58:34.687' AS DateTime), 1)
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__ACCOUNT__536C85E4FAD9B737]    Script Date: 10/22/2025 7:03:31 AM ******/
ALTER TABLE [dbo].[ACCOUNT] ADD UNIQUE NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__ACCOUNT__A9D1053402FA6922]    Script Date: 10/22/2025 7:03:31 AM ******/
ALTER TABLE [dbo].[ACCOUNT] ADD UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__POLICE__649F0F126112EFA7]    Script Date: 10/22/2025 7:03:31 AM ******/
ALTER TABLE [dbo].[POLICE] ADD UNIQUE NONCLUSTERED 
(
	[Patrol_Car_number] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__POLICE__F81CD45E9D97C276]    Script Date: 10/22/2025 7:03:31 AM ******/
ALTER TABLE [dbo].[POLICE] ADD UNIQUE NONCLUSTERED 
(
	[PoliceCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ACCOUNT] ADD  DEFAULT ((1)) FOR [AccountStatus]
GO
ALTER TABLE [dbo].[ACCOUNT] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[CARE_PARTNER] ADD  DEFAULT ((1)) FOR [PartnerStatus]
GO
ALTER TABLE [dbo].[CCTV_REPORT] ADD  DEFAULT ('Pending_Review') FOR [ConfirmationStatus]
GO
ALTER TABLE [dbo].[MISSING_DOCUMENT] ADD  DEFAULT (getdate()) FOR [ReportDate]
GO
ALTER TABLE [dbo].[MISSING_DOCUMENT] ADD  DEFAULT ('Missing') FOR [CaseStatus]
GO
ALTER TABLE [dbo].[VOLUNTEER] ADD  DEFAULT ((1)) FOR [VolunteerStatus]
GO
ALTER TABLE [dbo].[VOLUNTEER] ADD  DEFAULT ((3.0)) FOR [Rating]
GO
ALTER TABLE [dbo].[VOLUNTEER_REPORT] ADD  DEFAULT (getdate()) FOR [ReportTime]
GO
ALTER TABLE [dbo].[VOLUNTEER_REPORT] ADD  DEFAULT ('Submitted') FOR [ReportStatus]
GO
ALTER TABLE [dbo].[VOLUNTEER_SUBSCRIPTION] ADD  DEFAULT (getdate()) FOR [SubscribedDate]
GO
ALTER TABLE [dbo].[VOLUNTEER_SUBSCRIPTION] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[CARE_PARTNER]  WITH CHECK ADD FOREIGN KEY([ID])
REFERENCES [dbo].[ACCOUNT] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CCTV]  WITH CHECK ADD FOREIGN KEY([ID_Area])
REFERENCES [dbo].[AREA] ([ID])
GO
ALTER TABLE [dbo].[CCTV_REPORT]  WITH CHECK ADD FOREIGN KEY([ID_CCTV])
REFERENCES [dbo].[CCTV] ([ID])
GO
ALTER TABLE [dbo].[CCTV_REPORT]  WITH CHECK ADD FOREIGN KEY([ID_MissingDocument])
REFERENCES [dbo].[MISSING_DOCUMENT] ([ID])
GO
ALTER TABLE [dbo].[CCTV_REPORT]  WITH CHECK ADD FOREIGN KEY([ID_PoliceReviewer])
REFERENCES [dbo].[POLICE] ([ID])
GO
ALTER TABLE [dbo].[DETAIL_AREA_ACCOUNT]  WITH CHECK ADD FOREIGN KEY([ID_Account])
REFERENCES [dbo].[ACCOUNT] ([ID])
GO
ALTER TABLE [dbo].[DETAIL_AREA_ACCOUNT]  WITH CHECK ADD FOREIGN KEY([ID_Area])
REFERENCES [dbo].[AREA] ([ID])
GO
ALTER TABLE [dbo].[MANAGE_DOCUMENT]  WITH CHECK ADD FOREIGN KEY([ID_FoundVolunteer])
REFERENCES [dbo].[VOLUNTEER] ([ID])
GO
ALTER TABLE [dbo].[MANAGE_DOCUMENT]  WITH CHECK ADD FOREIGN KEY([ID_MissingDocument])
REFERENCES [dbo].[MISSING_DOCUMENT] ([ID])
GO
ALTER TABLE [dbo].[MANAGE_DOCUMENT]  WITH CHECK ADD FOREIGN KEY([ID_Police])
REFERENCES [dbo].[POLICE] ([ID])
GO
ALTER TABLE [dbo].[MISSING_DOCUMENT]  WITH CHECK ADD FOREIGN KEY([ID_MissingArea])
REFERENCES [dbo].[AREA] ([ID])
GO
ALTER TABLE [dbo].[MISSING_DOCUMENT]  WITH CHECK ADD FOREIGN KEY([ID_Reporter])
REFERENCES [dbo].[CARE_PARTNER] ([ID])
GO
ALTER TABLE [dbo].[POLICE]  WITH CHECK ADD FOREIGN KEY([ID])
REFERENCES [dbo].[ACCOUNT] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[VOLUNTEER]  WITH CHECK ADD FOREIGN KEY([ID])
REFERENCES [dbo].[ACCOUNT] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[VOLUNTEER_REPORT]  WITH CHECK ADD FOREIGN KEY([ID_MissingDocument])
REFERENCES [dbo].[MISSING_DOCUMENT] ([ID])
GO
ALTER TABLE [dbo].[VOLUNTEER_REPORT]  WITH CHECK ADD FOREIGN KEY([ID_Volunteer])
REFERENCES [dbo].[VOLUNTEER] ([ID])
GO
ALTER TABLE [dbo].[VOLUNTEER_REPORT]  WITH CHECK ADD FOREIGN KEY([SightingAreaID])
REFERENCES [dbo].[AREA] ([ID])
GO
ALTER TABLE [dbo].[VOLUNTEER_SUBSCRIPTION]  WITH CHECK ADD FOREIGN KEY([ID_MissingDocument])
REFERENCES [dbo].[MISSING_DOCUMENT] ([ID])
GO
ALTER TABLE [dbo].[VOLUNTEER_SUBSCRIPTION]  WITH CHECK ADD FOREIGN KEY([ID_Volunteer])
REFERENCES [dbo].[VOLUNTEER] ([ID])
GO