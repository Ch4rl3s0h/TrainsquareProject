USE [Trainsquare]
GO
/****** Object:  StoredProcedure [dbo].[EntityTypes_Insert]    Script Date: 5/1/2022 4:55:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Author,,Charles Oh>
-- Create date: <03/23/2022,,>
-- Description: <Insert new EntityTypes,,>
-- Code Reviewer: Changwoo Lee

-- MODIFIED BY: Charles Oh
-- MODIFIED DATE:03/23/2022
-- Code Reviewer: Changwoo Lee
-- Note:
-- =============================================


ALTER proc [dbo].[EntityTypes_Insert]
				@Id int OUTPUT
				,@Name nvarchar(100)

/*

	Declare @Id int
			,@Name nvarchar(100) = 'Venue'

	Execute [dbo].[EntityTypes_Insert]
			@Id OUTPUT
			,@Name

*/

as
BEGIN

	INSERT INTO [dbo].[EntityTypes]
				([Name])
	VALUES		
				(@Name)
	SET @Id = SCOPE_IDENTITY()


END
