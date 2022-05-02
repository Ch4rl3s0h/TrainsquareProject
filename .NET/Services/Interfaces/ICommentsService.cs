using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Comments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface ICommentsService
    {
        Comments Delete(int Id);
        void Update(CommentsUpdateRequest model, int Id);
        int Add(CommentsAddRequest model, int Id);
        Comments Get(int Id);
        Paged<Comments> GetAll(int pageIndex, int pageSize);
        Paged<Comments> GetCurrentPaged(int createdBy, int pageIndex, int pageSize);
        Paged<Comments> GetByEntityId(int EntityId, int EntityTypeId, int pageIndex, int pageSize);
        List<Comments> GetByParentId(int ParentId);
    }
}