using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.EntityTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IEntityTypesService
    {
        EntityTypes Get(int Id);
        Paged<EntityTypes> GetAll(int pageIndex, int pageSize);
        int Add(EntityTypesAddRequest model, int userId);
    }
}
