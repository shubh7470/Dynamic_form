import { Card, CardContent } from "@/components/ui/card";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function CourseView() {
  const { id } = useParams();
  const course = useSelector((state: RootState) =>
    state.courses.courses.find((c) => c._id == id)
  );
  console.log(course);

  return (
    <div className="w-full h-full flex justify-center items-start">
      <Card className="w-full  p-4 max-w-4xl grid grid-cols-1 lg:grid-cols-2 items-center min-w-[316px]">
        <div className=" overflow-hidden flex justify-center">
          <img
            src={course?.image}
            className="h-[300px] w-[300px] rounded-2xl"
            alt={course?.name}
          />
        </div>
        <div className="h-[300px] w-full border-[1px] border-gray-400 p-2">
          <CardContent className="flex flex-col gap-3">
            <div className="w-full flex gap-1 flex-col ">
              <h1 className="text-xl font-bold">{course?.name}</h1>
              <p>{course?.description}</p>
            </div>
            <div className="w-full grid gap-3 grid-cols-2">
              <div className="h-[70px] w-full rounded-full bg-amber-200"></div>
              <div className="h-[70px] w-full rounded-full bg-amber-200"></div>
              <div className="h-[70px] w-full rounded-full bg-amber-200"></div>
              <div className="h-[70px] w-full rounded-full bg-amber-200"></div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

export default CourseView;
