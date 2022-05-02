using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.EntityTypes;
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
    public class EntityTypesService : IEntityTypesService
    {
        IDataProvider _data = null;

        public EntityTypesService(IDataProvider data)
        {
            _data = data;
        }

        public EntityTypes Get(int Id)
        {
            string procName = "[dbo].[EntityTypes_Select_ById]";

            EntityTypes entityTypes = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", Id);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                entityTypes = MapEntityTypes(reader, ref startingIndex);
            });
            return entityTypes;
        }

        public Paged<EntityTypes> GetAll(int pageIndex, int pageSize)
        {
            Paged<EntityTypes> pagedList = null;
            List<EntityTypes> list = null;
            int totalCount = 0;

            string procName = "[dbo].[EntityTypes_SelectAll]";

            _data.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@pageIndex", pageIndex);
                param.AddWithValue("@pageSize", pageSize);
            },
            (reader, recordSetIndex) =>
            {
                int startingIndex = 0;
                EntityTypes entityTypes = MapEntityTypes(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<EntityTypes>();
                }

                list.Add(entityTypes);
            });
            if (list != null)
            {
                pagedList = new Paged<EntityTypes>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public int Add(EntityTypesAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[EntityTypes_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    addCommonParams(model, col);

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

        private static EntityTypes MapEntityTypes(IDataReader reader, ref int startingIndex)
        {
            EntityTypes entityTypes = new EntityTypes();

            entityTypes.Id = reader.GetSafeInt32(startingIndex++);
            entityTypes.Name = reader.GetSafeString(startingIndex++);

            return entityTypes;
        }

        private static void addCommonParams(EntityTypesAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Name", model.Name);
        }
    }
}
