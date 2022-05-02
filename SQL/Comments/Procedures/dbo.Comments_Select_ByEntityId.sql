USE [Trainsquare]
GO
/****** Object:  StoredProcedure [dbo].[Comments_Select_ByEntityId]    Script Date: 5/1/2022 4:53:19 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Author,,Charles Oh>
-- Create date: <03/23/2022,,>
-- Description: <Select Comment by EntityId and EntityTypeId,,>
-- Code Reviewer: Changwoo Lee, Abel Amezcua

-- MODIFIED BY: Charles Oh
-- MODIFIED DATE:03/23/2022
-- Code Reviewer: Changwoo Lee, Abel Amezcua
-- Note:
-- =============================================


ALTER proc [dbo].[Comments_Select_ByEntityId]
				@EntityId int
				,@EntityTypeId int
				,@pageIndex int
				,@pageSize int

/*

	Declare @EntityId int = 2
			,@EntityTypeId int = 1
			,@pageIndex int = 0
			,@pageSize int = 5

	Execute [dbo].[Comments_Select_ByEntityId] @EntityId
											   ,@EntityTypeId
											   ,@pageIndex
											   ,@pageSize

*/
as
BEGIN

	DECLARE @offset int = @pageIndex * @pageSize

	CREATE TABLE #Primary_Comments (Id int
									,Subject nvarchar(50)
									,Text nvarchar(3000)
									,ParentId int
									,EntityTypeId nvarchar(50)
									,EntityId int
									,DateCreated datetime2
									,DateModified datetime2
									,CreatedBy int
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
				,c.CreatedBy
				,c.IsDeleted
		FROM	dbo.Comments as c inner join [dbo].[EntityTypes] as e
					on c.EntityTypeId = e.Id
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
									,CreatedBy nvarchar(300)
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
				,up.AvatarUrl as CreatedBy
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
				,up.AvatarUrl as CreatedBy
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
