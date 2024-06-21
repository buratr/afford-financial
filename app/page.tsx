import CustomInput from "./components/CustomInput";
import {endpointRevenueChurn, endpointNewFormula} from "./lib/endpoints"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full flex flex-col justify-start items-center min-h-screen">
        <div className="mb-5 text-2xl font-medium w-full flex justify-center content-center items-center text-center">Test formula&nbsp; <div className="text-blue-500">pry.co</div></div>
        <div className="text-center mb-4">
          <div className="text-yellow-600 ">INFO</div>
          Works: "+", "-", "*", "/" and change TAG
        </div>
        <CustomInput name="Revenue Churn" endpoint={endpointRevenueChurn} />
        <CustomInput name="New Formula" endpoint={endpointNewFormula} />
      </div>
    </main>
  );
}

