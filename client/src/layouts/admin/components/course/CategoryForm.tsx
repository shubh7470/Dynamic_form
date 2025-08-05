import {
  addCourseCategoryAPI,
  updateCourseCategoryAPI,
} from "@/API/services/courseService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function CategoryForm({
  data,
  isOpen,
  setIsOpen,
  setEditDta,
}: {
  data: {
    name: string;
    id: string;
  } | null;
  isOpen: boolean;
  setIsOpen: () => void;
  setEditDta: () => void;
}) {
  console.log(data);

  const categorySchema = z.object({
    name: z.string().min(1, "Category is required"),
    id: z.string().nullable(),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "", // default email value
      id: "",
    },
  });
  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        id: data.id,
      });
    }
  }, [data, reset]);
  const onSubmit = (d: any) => {
    if (data) {
      updateCourseCategoryAPI(d)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            setIsOpen();
            setEditDta();
            reset();
            toast.success("Category updated successfully");
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 400) {
            reset();
            toast.error("Category already exists");
          }
          setIsOpen();
          setEditDta();
        });
    } else {
      addCourseCategoryAPI(d)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            setIsOpen();
            reset();
            toast.success("Category added successfully");
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 400) {
            reset();
            toast.error("Category already exists");
          }
          setIsOpen();
        });
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black/[0.4] z-50">
      <Card className="w-[400px] py-3 flex-col gap-2">
        <CardHeader className="w-full flex justify-start px-3 items-center">
          <p className="font-bold">
            {data ? "Update Category" : "Add Category"}
          </p>
        </CardHeader>
        <Separator />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-2"
        >
          <CardContent className="w-full flex flex-col gap-2 px-3">
            <Label htmlFor="category" className="text-sm font-semibold">
              Category Name
            </Label>
            <Input
              type="text"
              id="category"
              autoComplete="off"
              placeholder="Enter Category"
              {...register("name")}
              className={errors.name ? "border-red-500 focus:ring-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm ml-1">{errors.name.message}</p>
            )}
          </CardContent>
          <Separator className="mt-4" />
          <CardFooter className="w-full flex justify-end px-3">
            <Button
              variant="outline"
              className="text-sm font-semibold"
              onClick={() => {
                setIsOpen();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="ml-2 text-sm font-semibold">
              {data ? "Update" : "Add"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default CategoryForm;
