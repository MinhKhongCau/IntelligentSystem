CREATE PROCEDURE dbo.usp_RegisterAccount
    @Username NVARCHAR(255),
    @Password NVARCHAR(255),
    @Email NVARCHAR(255),
    @FullName NVARCHAR(255) = NULL,
    @Birthday DATE = NULL,
    @Address NVARCHAR(MAX) = NULL,
    @Gender BIT = NULL,
    @Phone VARCHAR(20) = NULL,
    @ProfilePictureUrl VARCHAR(MAX) = NULL,
    @AccountType NVARCHAR(50),
    @AccountStatus BIT = NULL, -- if NULL DB default (1) will be used
    @NewId INT = NULL OUTPUT,
    @StatusCode INT = NULL OUTPUT, -- 0 = success, 1 = username exists, 2 = email exists, 3 = error
    @Message NVARCHAR(4000) = NULL OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- check username
        IF EXISTS (SELECT 1 FROM dbo.ACCOUNT WITH (NOLOCK) WHERE Username = @Username)
        BEGIN
            SET @StatusCode = 1;
            SET @Message = N'Username already exists';
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- check email
        IF EXISTS (SELECT 1 FROM dbo.ACCOUNT WITH (NOLOCK) WHERE Email = @Email)
        BEGIN
            SET @StatusCode = 2;
            SET @Message = N'Email already in use';
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Use provided AccountStatus or default to 1
        DECLARE @Status BIT = ISNULL(@AccountStatus, 1);

        INSERT INTO dbo.ACCOUNT
            (Username, Password, Email, FullName, Birthday, Address, Gender, Phone, ProfilePictureUrl, AccountType, AccountStatus, CreatedAt)
        VALUES
            (@Username, @Password, @Email, @FullName, @Birthday, @Address, @Gender, @Phone, @ProfilePictureUrl, @AccountType, @Status, GETDATE());

        SET @NewId = SCOPE_IDENTITY();
        SET @StatusCode = 0;
        SET @Message = N'Account created';

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0
            ROLLBACK TRANSACTION;

        SET @StatusCode = 3;
        SET @Message = ERROR_MESSAGE() + N' | ' + ISNULL(ERROR_PROCEDURE(), N'') + N' at line ' + CAST(ERROR_LINE() AS NVARCHAR(10));
        RETURN;
    END CATCH
END
GO