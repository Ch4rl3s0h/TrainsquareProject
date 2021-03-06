USE [Trainsquare]
GO
/****** Object:  StoredProcedure [dbo].[Comments_Update]    Script Date: 5/1/2022 4:54:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Author,,Charles Oh>
-- Create date: <03/23/2022,,>
-- Description: <Update a Comment,,>
-- Code Reviewer: Changwoo Lee

-- MODIFIED BY: Charles Oh
-- MODIFIED DATE:03/23/2022
-- Code Reviewer: Changwoo Lee
-- Note:
-- =============================================


ALTER proc [dbo].[Comments_Update]
			@Id int
			,@Subject nvarchar(50)
			,@Text nvarchar(3000)
			,@ParentId int
			,@EntityTypeId int
			,@EntityId int
			,@CreatedBy int
			,@IsDeleted bit

/*

	Declare @Id int = 1
			,@Subject nvarchar(50) = 'New Subject'
			,@Text nvarchar(3000) = 'My comment has been updated'
			,@ParentId int = 2
			,@EntityTypeId int = 1
			,@EntityId int = 2
			,@CreatedBy int = 2
			,@IsDeleted bit = 1

	Execute [dbo].[Comments_Update] @Id
									,@Subject
									,@Text
									,@ParentId
									,@EntityTypeId
									,@EntityId
									,@CreatedBy
									,@IsDeleted

*/

as
BEGIN

	DECLARE @date datetime2 = getutcdate();

	UPDATE [dbo].[Comments]

		SET [Subject] = @Subject
			,[Text] = @Text
			,[ParentId] = @ParentId
			,[EntityTypeId] = @EntityTypeId
			,[EntityId] = @EntityId
			,[CreatedBy] = @CreatedBy
			,[IsDeleted] = @IsDeleted

		WHERE Id = @Id

END
