import React from 'react';
import { useQuery } from '@tanstack/react-query';
import request from '../utils/axios';
import { useGlobalState } from '../globalState';

const state: IGridState = {
  loading: true,
  rows: [],
  totalRows: 0,
  rowsPerPageOptions: [10, 20, 50],
  pageSize: 10,
  page: 1,
  rowCount: 0,
  sort: 'created_At',
  asc: false,
  selectedIds: [],
  search: ''
};

export const useReactQueryHook = (props: { url: string; name: string }) => {
  const { url, name } = props;
  const [list, setList] = React.useState<IGridState>({
    ...state
  });
  const {
    user: [{ auth }]
  } = useGlobalState();

  const findAllData = async () => {
    const { search, asc, sort, pageSize, page } = list;
    let query: string = `?page=${page}`;
    if (pageSize) {
      query += `&pageSize=${pageSize}`;
    }
    if (sort) {
      query += `&sort=${sort}&asc=${asc.toString()}`;
    }
    if (search) {
      query += `&search=${search}`;
    }
    const { data } = await request(auth.access_token).get(`/api/${url}${query}`);

    setList((prevList: any) => ({
      ...prevList,
      // @ts-ignore
      rows: data.docs.map(({ _id, ...rest }) => ({ id: _id, ...rest })),
      totalRows: data.totalDocs
    }));
    return data;
  };

  const { isLoading, isFetching, isFetched, data, refetch } = useQuery(
    [name, list.page, list.pageSize, list.sort, list.asc],
    () => findAllData()
  );

  return { isLoading, isFetching, isFetched, data, refetch, list, setList };
};
