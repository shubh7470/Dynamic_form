import {
  addCourseAPI,
  getAllCourseCategoryAPI,
} from "@/API/services/courseService";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/layouts/components/ImageUploader";
import { SearchSelect } from "@/layouts/components/SearchSelect";
import { courseSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function CourseForm() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([
    {
      value: "",
      label: "",
    },
  ]);
  const [value2, setValue2] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      image: undefined,
      description: "",
      category: "",
      price: 0,
      branchprice: 0,
      duration: 0,
    },
  });
  useEffect(() => {
    getAllCourseCategoryAPI()
      .then((res) => {
        setCategories(res.data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        console.error("API error:", err);
      });
  }, []);

  useEffect(() => {
    if (value2) {
      setValue("category", value2);
    }
  }, [value2]);

  const onSubmit = (data: any) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    console.log(formData);
    addCourseAPI(formData)
      .then((res: any) => {
        console.log(res);

        if (res.status === 200) {
          handleReset();
          toast.success("Course created successfully");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 400) {
          handleReset();
          toast.error("Course already exists");
        } else {
          toast.error("Somthing went wrong");
        }
      });
  };

  const handleReset = () => {
    reset();
    setValue2("");
  };

  // console.log(categories);

  return (
    <div className="w-full h-full flex justify-center items-start">
      <Card className="w-full p-4 max-w-7xl gap-y-3">
        <CardHeader className="font-bold  h-[36px] ">
          <div className="w-full h-full  flex justify-between items-center">
            <h2>Add Course</h2>

            <Button
              onClick={() => navigate("/admin/courses")}
              variant="outline"
              className="text-sm font-semibold w-[70px]"
            >
              back
            </Button>
          </div>
        </CardHeader>
        <Separator />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full flex flex-col gap-4"
        >
          <div className="flex-2rounded-xl gap-y-4 gap-x-7 grid grid-cols-1 lg:grid-cols-2">
            <div className="gap-2 flex flex-col  ">
              <Label className="text-sm font-semibold">Course Category</Label>
              <SearchSelect
                width="100%"
                data={categories}
                title="Select Category"
                notFound="Not Found"
                value={value2}
                setValue={setValue2}
                placeholder="Search Category"
                className={
                  errors.category ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.category && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="name" className="text-sm font-semibold">
                Course Name
              </Label>
              <Input
                type="text"
                id="name"
                {...register("name")}
                autoComplete="off"
                placeholder="Course Name"
                className={
                  errors.name ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.name && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="gap-2 flex flex-col ">
              <Label htmlFor="duration" className="text-sm font-semibold">
                {`Course Duration (Month)`}
              </Label>
              <Input
                type="number"
                id="duration"
                {...register("duration")}
                autoComplete="off"
                placeholder="Course Duration"
                className={
                  errors.duration ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.duration && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.duration.message}
                </p>
              )}
            </div>

            <div className="gap-2 flex flex-col ">
              <Label htmlFor="price" className="text-sm font-semibold">
                Course Price
              </Label>
              <Input
                type="number"
                id="price"
                {...register("price")}
                autoComplete="off"
                placeholder="Course Price"
                className={
                  errors.price ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.price && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="branchprice" className="text-sm font-semibold">
                Branch Price
              </Label>
              <Input
                type="number"
                id="branchprice"
                {...register("branchprice")}
                autoComplete="off"
                placeholder="Branch Price"
                className={
                  errors.branchprice ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.branchprice && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.branchprice.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="description" className="text-sm font-semibold">
                Course Description
              </Label>
              <Textarea
                {...register("description")}
                id="description"
                placeholder="Course Description"
                className={
                  errors.description ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.description && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="image" className="text-sm font-semibold">
                Course Image
              </Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.image?.message}
                    previewUrl="" // optional, for edit
                    maxSizeMB={1}
                  />
                )}
              />
              {errors.image && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.image.message}
                </p>
              )}
            </div>
          </div>
          <Separator />
          <CardFooter className="w-full flex justify-end px-3">
            <Button
              onClick={handleReset}
              type="reset"
              variant="outline"
              className="text-sm font-semibold"
            >
              Refresh
            </Button>
            <Button type="submit" className="ml-2 text-sm font-semibold">
              {"Add"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default CourseForm;
