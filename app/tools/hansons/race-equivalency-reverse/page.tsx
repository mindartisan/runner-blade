import HansonsReverseCalculator from "@/components/hansons/race-equivalency-reverse/HansonsReverseCalculator"

export const metadata = {
  title: "汉森反向计算器 - RunnerBlade",
  description: "根据目标成绩推算当前需要达到的水平，基于汉森训练体系",
}

export default function ReverseCalculatorPage() {
  return <HansonsReverseCalculator />
}
