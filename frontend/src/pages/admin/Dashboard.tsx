import { lazy } from "react"

const DataChart = lazy(()=> import("../../components/DataChart"))

function Dashboard() {
  return (
    <DataChart />
  )
}

export default Dashboard