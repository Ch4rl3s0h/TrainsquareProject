USE [Trainsquare]
GO
/****** Object:  StoredProcedure [dbo].[CommentsAndReplies]    Script Date: 5/1/2022 4:43:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Author,,Charles Oh>
-- Create date: <04/19/2022,,>
-- Description: <Select Comment and Replies,>
-- Code Reviewer: Elizabeth Phung

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer: 
-- Note:
-- =============================================


ALTER PROC [dbo].[CommentsAndReplies]
			@pageIndex int
			,@pageSize int

/*

	Declare @pageIndex int = 0
			,@pageSize int = 10

	EXECUTE [dbo].[CommentsAndReplies] @pageIndex
										,@pageSize

*/
as

BEGIN

	DECLARE @offset int = @pageIndex * @pageSize;

	CREATE TABLE #Primary_Comments (Id int
									,Subject nvarchar(50)
									,Text nvarchar(3000)
									,ParentId int
									,EntityTypeId nvarchar(50)
									,EntityId int
									,DateCreated datetime2
									,DateModified datetime2
									,CreatedBy int
									,FirstName nvarchar(100)
									,Lastname nvarchar(100)
									,AvatarUrl nvarchar(300)
									,IsDeleted bit
									)
	INSERT INTO #Primary_Comments
		SELECT  c.Id
				,c.[Subject]
				,c.[Text]
				,c.ParentId
				,e.[Name] as EntityType
				,c.EntityId
				,c.DateCreated
				,c.DateModified
				,up.Id as CreatedBy
				,up.FirstName
				,up.LastName
				,up.AvatarUrl
				,c.IsDeleted
		FROM	dbo.Comments as c inner join [dbo].[EntityTypes] as e
					on c.EntityTypeId = e.Id
								  inner join [dbo].[UserProfiles] as up
					on c.CreatedBy = up.Id
		WHERE	c.ParentId = 0

	ORDER BY  c.Id DESC
	OFFSET @offset Rows
	FETCH NEXT @pageSize Rows ONLY

	CREATE TABLE #Reply_Comments	(Id int
									,Subject nvarchar(50)
									,Text nvarchar(3000)
									,ParentId int
									,EntityTypeId nvarchar(50)
									,EntityId int
									,DateCreated datetime2
									,DateModified datetime2
									,CreatedBy int
									,FirstName nvarchar(100)
									,Lastname nvarchar(100)
									,AvatarUrl nvarchar(300)
									,IsDeleted bit
									)

	INSERT INTO #Reply_Comments  
		SELECT  c.Id
				,c.[Subject]
				,c.[Text]
				,c.ParentId
				,e.[Name] as EntityType
				,c.EntityId
				,c.DateCreated
				,c.DateModified
				,up.Id as CreatedBy
				,up.FirstName
				,up.LastName
				,up.AvatarUrl
				,c.IsDeleted
		FROM	dbo.Comments as c inner join [dbo].[EntityTypes] as e
					on c.EntityTypeId = e.Id
								  inner join [dbo].[UserProfiles] as up
					on c.CreatedBy = up.Id

		Where c.ParentId > 0


	SELECT		 p.Id
				,p.[Subject]
				,p.[Text]
				,p.ParentId
				,e.[Name] as EntityType
				,p.EntityId
				,p.DateCreated
				,p.DateModified
				,up.Id as CreatedBy
				,up.FirstName
				,up.LastName
				,up.AvatarUrl
				,p.IsDeleted
		,Replies =( SELECT * FROM #Reply_Comments as rc 
					WHERE rc.ParentId = P.Id
					for JSON AUTO
				)

	FROM #Primary_Comments as p inner join [dbo].[EntityTypes] as e
					on p.EntityId = e.Id
								inner join [dbo].[UserProfiles] as up
					on p.CreatedBy = up.Id

	DROP Table #Primary_Comments
	DROP Table #Reply_Comments

END