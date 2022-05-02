USE [Trainsquare]
GO
/****** Object:  StoredProcedure [dbo].[Comments_Delete]    Script Date: 5/1/2022 4:52:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Author,,Charles Oh>
-- Create date: <03/23/2022,,>
-- Description: <Delete Comment by Id,,>
-- Code Reviewer: Changwoo Lee

-- MODIFIED BY: Charles Oh
-- MODIFIED DATE:03/23/2022
-- Code Reviewer: Changwoo Lee
-- Note:
-- =============================================


ALTER proc [dbo].[Comments_Delete]
				@Id int

/*

	Declare @Id int = 1

	Execute [dbo].[Comments_Delete] @Id

*/

as
BEGIN

	DELETE 
	FROM  [dbo].[Comments]
	WHERE Id = @Id

END