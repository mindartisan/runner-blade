import TreadmillCalculator from "@/components/hansons/treadmill/TreadmillCalculator"

export const metadata = {
  title: "跑步机配速计算器 - RunnerBlade",
  description: "计算跑步机不同坡度对应的等效配速，支持 MPH 和配速两种输入模式，基于汉森训练体系",
}

export default function TreadmillPage() {
  return <TreadmillCalculator />
}
