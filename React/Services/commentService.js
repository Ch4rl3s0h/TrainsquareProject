import axios from 'axios';
import { API_HOST_PREFIX, onGlobalSuccess, onGlobalError } from './serviceHelpers';
import debug from 'sabio-debug';

const _logger = debug.extend('commentService');

const add = (payload) => {
    const config = {
        method: 'POST',
        url: `${API_HOST_PREFIX}/api/comments`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const paginate = (pageIndex, pageSize) => {
    _logger(pageIndex, pageSize);
    const config = {
        method: 'GET',
        url: `${API_HOST_PREFIX}/api/comments/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const remove = (payload) => {
    const config = {
        method: 'DELETE',
        url: `${API_HOST_PREFIX}/api/comments/${payload}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    _logger(payload);
    return axios(config);
};

const update = (payload) => {
    _logger(payload);
    const commentId = payload.id;
    const config = {
        method: 'PUT',
        url: `${API_HOST_PREFIX}/api/comments/${commentId}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    _logger(payload);
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByCurrent = (pageIndex, pageSize) => {
    _logger(pageIndex, pageSize);
    const config = {
        method: 'GET',
        url: `${API_HOST_PREFIX}/api/comments/current/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByEntity = (entityId, entityTypeId, pageIndex, pageSize) => {
    _logger(entityId, entityTypeId);
    const config = {
        method: 'GET',
        url: `${API_HOST_PREFIX}/api/comments/${entityId}/${entityTypeId}/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByParentId = (parentId) => {
    _logger(parentId);
    const config = {
        method: 'GET',
        url: `${API_HOST_PREFIX}/api/comments/parent/${parentId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const commentService = {
    add,
    paginate,
    remove,
    update,
    getByCurrent,
    getByEntity,
    getByParentId,
};

export default commentService;
