import { useState } from 'react';
import * as conf from '@/config';
import { ROLE_POLICY } from '@/constants/pdpa';
import useAuth from '@/hooks/useAuth';
import useSnackbar from '@/hooks/useSnackbar';
import { getErrorMessage } from '@/services/api/axios';
import { useExportUserMutation, useGetUsersQuery } from '@/services/queries/user';
import { TypeResUserData } from '@/types/products/user';
import downloadJson from '@/utils/downloadJson';
import { UserModalState, UserSearchState } from './type';

const useListUserTable = () => {
  const role = useAuth().user!.role;
  const { openSnackbar } = useSnackbar();
  const policy = ROLE_POLICY[role];

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState<UserSearchState>({ search: '', page: conf.DEFAULT_PAGE, pageSize: conf.DEFAULT_PAGE_SIZE });
  const [modal, setModal] = useState<UserModalState>({ type: 'closed' });

  const { data: usersData, isLoading, isFetching, error } = useGetUsersQuery({ role, ...search });
  const { mutateAsync: exportUser } = useExportUserMutation();

  const data = usersData?.payload?.datas ?? [];
  const total = usersData?.payload?.total ?? 0;

  const handleSearch = () => setSearch((s) => ({ ...s, search: searchInput.trim(), page: conf.DEFAULT_PAGE }));

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch((s) => ({ ...s, search: '', page: conf.DEFAULT_PAGE }));
  };

  const handleChangePage = (page: number) => setSearch((s) => ({ ...s, page }));

  const handleChangePageSize = (pageSize: number) => setSearch((s) => ({ ...s, pageSize, page: conf.DEFAULT_PAGE }));

  const handleCreate = () => setModal({ type: 'create' });
  const handleView = (user: TypeResUserData) => setModal({ type: 'view', user });
  const handleEdit = (user: TypeResUserData) => setModal({ type: 'edit', user });
  const handleDelete = (user: TypeResUserData) => setModal({ type: 'delete', user });
  const handleCloseModal = () => setModal({ type: 'closed' });

  /** สิทธิขอรับสำเนาข้อมูล (มาตรา 30/31) */
  const handleExport = async (user: TypeResUserData) => {
    try {
      const res = await exportUser({ id: user.id });
      downloadJson(res.payload, `user-${user.id}.json`);
      openSnackbar('ส่งออกข้อมูลสำเร็จ');
    } catch (err) {
      openSnackbar(getErrorMessage(err), 'error');
    }
  };

  return {
    role,
    policy,
    data,
    total,
    isLoading: isLoading || isFetching,
    errorMessage: error ? getErrorMessage(error) : null,
    search,
    searchInput,
    setSearchInput,
    handleSearch,
    handleClearSearch,
    handleChangePage,
    handleChangePageSize,
    modal,
    handleCreate,
    handleView,
    handleEdit,
    handleDelete,
    handleExport,
    handleCloseModal
  };
};

export default useListUserTable;
