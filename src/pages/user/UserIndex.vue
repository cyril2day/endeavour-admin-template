<script setup lang="ts">
import { deleteUser, getUsers } from '@/api/users'
import User from '@/types/user'
import { useQuasar } from 'quasar'
import { columns } from './UserIndex'

type User = Pick<User.Bio, 'id' | 'first_name' | 'last_name' | 'email'> &
  Pick<User.Account, 'username'> &
  User.Permission

const q = useQuasar()
const router = useRouter()

const userRows = ref<User[]>([])
const loading = ref(true)

const userEdit = (user: User) => {
  router.push({ name: 'User Edit', params: { userId: `${user.id}` } })
}

const fetchTable = async () => {
  userRows.value = []
  loading.value = true

  try {
    const { data } = await getUsers({})
    if (data && data.data instanceof Array) {
      /* eslint-disable-next-line */
      data.data.forEach((d: any) => {
        const { email, username, first_name, last_name } = d.attributes
        const { data: roles } = d.relationships.roles
        console.log(roles)
        userRows.value.push({
          id: parseInt(d.id),
          email: email,
          roles: roles[0],
          username: username,
          first_name: first_name,
          last_name: last_name,
        })
      })
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const userDelete = (user: User) => {
  deleteUser(user.id)
  fetchTable()
}

const exportToExcel = () => {
  console.log('Export to excel')
}

onBeforeMount(() => {
  fetchTable()
})
</script>

<template>
  <div class="q-ma-md">
    <q-table
      class="user-table user-table__sticky-column"
      title="Users"
      flat
      bordered
      :loading="loading"
      :grid="q.screen.xs"
      :columns="columns"
      :rows="userRows"
      row-key="id"
    >
      <template v-slot:body-cell-actions="{ row }">
        <q-td>
          <q-btn-group flat>
            <q-btn
              label="Edit"
              icon="edit"
              size="sm"
              @click="userEdit(row)"
            ></q-btn>

            <q-btn
              label="Delete"
              icon="delete"
              size="sm"
              @click="userDelete(row)"
            ></q-btn>
          </q-btn-group>
        </q-td>
      </template>

      <template v-slot:top-right>
        <q-btn
          color="primary"
          icon-right="archive"
          label="Export to excel"
          no-caps
          @click="exportToExcel"
        />
      </template>
    </q-table>
  </div>
</template>

<style lang="scss" scoped>
.user-table__sticky-column {
  /* set sticky column to the 7th child, which is the `Actions` column */

  th:nth-child(7),
  td:nth-child(7) {
    position: sticky;
    right: 0;
    background-color: #f7f7f7;
  }
}

.user-table__header-id {
  width: 80px;
}

.user-table__header-email {
  width: 270px;
}

.user-table__header-role {
  width: 200px;
}

.user-table__header-username {
  width: 220px;
}

.user-table__header-firstname {
  width: 220px;
}

.user-table__header-lastname {
  width: 220px;
}
</style>
