import { Grid } from '@mui/material'

import { useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import CustomDataGrid from 'src/components/DataGrid/dataGrid'
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'age2',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
]

// Sample rows data
const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, age2: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42, age2: 35 },
  // { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  // { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  // { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  // { id: 6, lastName: 'Melisandre', firstName: 'NA', age: 150 },
  // { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  // { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  // { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
]
const ClassPage = () => {
  const { id } = useParams()
  console.log('the id is ', id)
  return (
    <>
      <Grid component="main" maxWidth="xs" textAlign="center" margin="auto">
        <Metadata title="Class" description="Class page" />
        <CustomDataGrid columns={columns} rows={rows} />
        <h1>ClassPage</h1>
        <p>
          Find me in <code>./web/src/pages/ClassPage/ClassPage.tsx</code>
        </p>
      </Grid>
    </>
  )
}

export default ClassPage
