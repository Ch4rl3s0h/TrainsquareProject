USE [Trainsquare]
GO
/****** Object:  StoredProcedure [dbo].[Comments_SelectAll]    Script Date: 5/1/2022 4:44:04 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Author,,Charles Oh>
-- Create date: <03/23/2022,,>
-- Description: <Select all Comments,>
-- Code Reviewer: Changwoo Lee, Abel Amezcua

-- MODIFIED BY: Charles Oh
-- MODIFIED DATE:03/23/2022
-- Code Reviewer: Changwoo Lee
-- Note:
-- =============================================

ALTER proc [dbo].[Comments_SelectAll]
			@pageIndex int
			,@pageSize int

/*

	Declare @pageIndex int = 0
			,@pageSize int = 20

	Execute [dbo].[Comments_SelectAll] @pageIndex
										,@pageSize

*/

as
BEGIN
	
	DECLARE @offset int = @pageIndex * @pageSize;

	SELECT  c.Id
			,c.[Subject]
			,c.[Text]
			,c.ParentId
			,e.[Name] as EntityType
			,c.EntityId
			,c.DateCreated
			,c.DateModified
			,p.AvatarUrl as CreatedBy
			,c.IsDeleted
			, TotalCount = COUNT(1) OVER()
	FROM	[dbo].[Comments] as c inner join [dbo].[EntityTypes] as e
					on c.EntityId = e.Id
							inner join [dbo].[UserProfiles] as p
					on c.CreatedBy = p.Id

	ORDER BY c.Id DESC

	OFFSET @offset Rows
	FETCH NEXT @pageSize Rows ONLY

END

