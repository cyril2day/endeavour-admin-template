import { QTableProps } from 'quasar'

export const columns: QTableProps['columns'] = [
  /* the ID column */
  {
    name: 'id',
    label: '#',
    field: 'id',
    align: 'left',
    sortable: true,
    classes: 'user-table__header-id',
  },
  /* the email column */
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left',
    classes: 'user-table__header-email',
  },
  /* the username column */
  {
    name: 'username',
    label: 'Username',
    field: 'username',
    align: 'left',
    classes: 'user-table__header-username',
  },
  /* the first name column */
  {
    name: 'first_name',
    label: 'First Name',
    field: 'first_name',
    align: 'left',
    classes: 'user-table__header-firstname',
  },
  /* the last name  column */
  {
    name: 'last_name',
    label: 'Last Name',
    field: 'last_name',
    align: 'left',
    classes: 'user-table__header-lastname',
  },
  /* the actions column */
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'left',
  },
]
