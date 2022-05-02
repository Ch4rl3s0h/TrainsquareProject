using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Comments;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class CommentsService : ICommentsService
    {
        IDataProvider _data = null;

        public CommentsService(IDataProvider data)
        {
            _data = data;
        }

        public Comments Delete(int Id)
        {
            string procName = "[dbo].[Comments_Delete]";

            Comments comment = null;

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection deleteCol)
                {
                    deleteCol.AddWithValue("@Id", Id);
                },
                delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    comment = MapComments(reader, ref startingIndex);
                });
            return comment;
        }

        public void Update(CommentsUpdateRequest model, int Id)
        {
            string procName = "[dbo].[Comments_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    addCommonParams(model, col, Id);
                    col.AddWithValue("@Id", model.Id);
                },
                returnParameters: null);
        }

        public int Add(CommentsAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Comments_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    addCommonParams(model, col, userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCol)
                {
                    object oId = returnCol["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });
            return id;
        }

        public Comments Get(int Id)
        {
            string procName = "[dbo].[Comments_Select_ById]";

            Comments comment = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", Id);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                comment = MapComments(reader, ref startingIndex);
            });
            return comment;
        }

        public Paged<Comments> GetAll(int pageIndex, int pageSize)
        {
            Paged<Comments> pagedList = null;
            List<Comments> list = null;
            int totalCount = 0;

            string procName = "[dbo].[CommentsAndReplies]";

            _data.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@pageIndex", pageIndex);
                param.AddWithValue("@pageSize", pageSize);
            },
            (reader, recordSetIndex) =>
            {
                int startingIndex = 0;
                Comments comment = MapComments(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<Comments>();
                }

                list.Add(comment);
            });
            if (list != null)
            {
                pagedList = new Paged<Comments>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Comments> GetCurrentPaged(int createdBy, int pageIndex, int pageSize)
        {
            Paged<Comments> pagedList = null;
            List<Comments> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Comments_Select_ByCreatedBy]";

            _data.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@CreatedBy", createdBy);
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            },
            (reader, recordSetIndex) =>
            {
                int startingIndex = 0;
                Comments comment = MapComments(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Comments>();
                }

                list.Add(comment);
            }
            );
            if (list != null)
            {
                pagedList = new Paged<Comments>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Comments> GetByEntityId(int EntityId, int EntityTypeId, int pageIndex, int pageSize)
        {
            Paged<Comments> pagedList = null;
            List<Comments> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Comments_Select_ByEntityId]";

            _data.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@EntityId", EntityId);
                param.AddWithValue("@EntityTypeId", EntityTypeId);
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            },
            (reader, recordSetIndex) =>
            {
                int startingIndex = 0;
                Comments comment = MapComments(reader, ref startingIndex);
                //if (totalCount == 0)
                //{
                //    totalCount = reader.GetSafeInt32(startingIndex++);
                //}
                if (list == null)
                {
                    list = new List<Comments>();
                }

                list.Add(comment);
            });
            if (list != null)
            {
                pagedList = new Paged<Comments>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public List<Comments> GetByParentId(int ParentId)
        {
            List<Comments> list = null;
            string procName = "[dbo].[Comments_Select_ByParentId]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@ParentId", ParentId);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Comments comment = MapComments(reader, ref startingIndex);
                if (list == null)
                {
                    list = new List<Comments>();
                }
                list.Add(comment);
            });
            return list;
        }

        private Comments MapComments(IDataReader reader, ref int startingIndex)
        {
            Comments comments = new Comments();

            comments.Id = reader.GetSafeInt32(startingIndex++);
            comments.Subject = reader.GetSafeString(startingIndex++);
            comments.Text = reader.GetSafeString(startingIndex++);
            comments.ParentId = reader.GetSafeInt32(startingIndex++);
            comments.EntityType = reader.GetSafeEnum<EntityType>(startingIndex++);
            comments.EntityId = reader.GetSafeInt32(startingIndex++);
            comments.DateCreated = reader.GetSafeDateTime(startingIndex++);
            comments.DateModified = reader.GetSafeDateTime(startingIndex++);
            comments.CreatedBy = reader.GetSafeInt32(startingIndex++);
            comments.FirstName = reader.GetSafeString(startingIndex++);
            comments.LastName = reader.GetSafeString(startingIndex++);
            comments.AvatarUrl = reader.GetSafeString(startingIndex++);
            comments.IsDeleted = reader.GetSafeBool(startingIndex++);

            comments.Replies = reader.DeserializeObject<List<Comments>>(startingIndex++);

            return comments;
        }

        private static void addCommonParams(CommentsAddRequest model, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@Subject", model.Subject);
            col.AddWithValue("@Text", model.Text);
            col.AddWithValue("@ParentId", model.ParentId);
            col.AddWithValue("@EntityTypeId", model.EntityTypeId);
            col.AddWithValue("@EntityId", model.EntityId);
            col.AddWithValue("@CreatedBy", userId);
            col.AddWithValue("@IsDeleted", model.IsDeleted);
        }
    }
}