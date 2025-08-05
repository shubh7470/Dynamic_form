import { addBranchAPI } from "@/API/services/branchService";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/layouts/components/ImageUploader";
import { SearchSelect } from "@/layouts/components/SearchSelect";
import { branchSchema } from "@/schemas/branch";
import { indianStates } from "@/utils/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

function BranchForm() {
  const durations = ["3 Month", "6 Month", "12 Month", "18 Month", "24 Month"];
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      password: "",
      branchName: "",
      email: "",
      code: "",
      address: "",
      phone: "",
      directorname: "",
      directoradress: "",
      location: "",
      dist: "",
      state: "",
      religion: "",
      signature: undefined,
      image: undefined,
      coursefees: durations.map((duration) => ({
        duration,
        fees: "",
      })),
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    console.log(formData);
    addBranchAPI(formData)
      .then((res: any) => {
        console.log(res);
        if (res.status === 200) {
          handleReset();
          toast.success("Branch created successfully");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 400) {
          handleReset();
          toast.error("Branch already exists with this email");
        } else {
          toast.error("Somthing went wrong");
        }
      });
  };

  const handleReset = () => {
    reset();
  };

  console.log(errors);

  return (
    <div className="w-full h-full flex justify-center items-start">
      <Card className="w-full p-4 max-w-7xl gap-y-3">
        <CardHeader className="font-bold  h-[36px] ">
          <div className="w-full h-full  flex justify-between items-center">
            <h2>Add Branch</h2>
          </div>
        </CardHeader>
        <Separator />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full flex flex-col gap-4"
        >
          <div className="flex-2rounded-xl gap-y-4 gap-x-7 grid grid-cols-1 lg:grid-cols-2">
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="name" className="text-sm font-semibold">
                User Name
              </Label>
              <Input
                type="text"
                id="name"
                {...register("name")}
                autoComplete="off"
                placeholder="User Name"
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
              <Label htmlFor="password" className="text-sm font-semibold">
                Password
              </Label>
              <Input
                type="text"
                id="password"
                {...register("password")}
                autoComplete="off"
                placeholder="Password"
                className={
                  errors.password ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.password && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="branchName" className="text-sm font-semibold">
                Branch Name
              </Label>
              <Input
                type="text"
                id="branchName"
                {...register("branchName")}
                autoComplete="off"
                placeholder="Course Name"
                className={
                  errors.name ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.branchName && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.branchName.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="code" className="text-sm font-semibold">
                Branch Code
              </Label>
              <Input
                type="text"
                id="code"
                {...register("code")}
                autoComplete="off"
                placeholder="Branch Code"
                className={
                  errors.code ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.code && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.code.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email
              </Label>
              <Input
                type="text"
                id="email"
                {...register("email")}
                autoComplete="off"
                placeholder="Email"
                className={
                  errors.email ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.email && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="phone" className="text-sm font-semibold">
                Phone Number
              </Label>
              <Input
                type="text"
                id="phone"
                {...register("phone")}
                autoComplete="off"
                placeholder="Phone Number"
                className={
                  errors.phone ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.phone && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="directorname" className="text-sm font-semibold">
                Director name
              </Label>
              <Input
                type="text"
                id="directorname"
                {...register("directorname")}
                autoComplete="off"
                placeholder="Director name"
                className={
                  errors.directorname ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.directorname && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.directorname.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col  ">
              <Label htmlFor="state" className="text-sm font-semibold">
                State{" "}
              </Label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    width="100%"
                    data={indianStates}
                    title="Select State"
                    notFound="Not Found"
                    value={field.value}
                    setValue={field.onChange}
                    placeholder="Search State"
                    className={
                      errors.state ? "border-red-500 focus:ring-red-500" : ""
                    }
                  />
                )}
              />
              {errors.state && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.state.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="dist" className="text-sm font-semibold">
                District
              </Label>
              <Input
                type="text"
                id="dist"
                {...register("dist")}
                autoComplete="off"
                placeholder="District"
                className={
                  errors.dist ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.dist && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.dist.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="location" className="text-sm font-semibold">
                Location
              </Label>
              <Input
                type="text"
                id="location"
                {...register("location")}
                autoComplete="off"
                placeholder="Location"
                className={
                  errors.location ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.location && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.location.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="address" className="text-sm font-semibold">
                Branch Address
              </Label>
              <Textarea
                id="address"
                {...register("address")}
                autoComplete="off"
                placeholder="Branch Address"
                className={
                  errors.address ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.address && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="directoradress" className="text-sm font-semibold">
                Direcctor Address
              </Label>
              <Textarea
                id="directoradress"
                {...register("directoradress")}
                autoComplete="off"
                placeholder="Director Address"
                className={
                  errors.directoradress
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }
              />
              {errors.directoradress && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.directoradress.message}
                </p>
              )}
            </div>
            <div className="gap-2 flex flex-col ">
              <Label htmlFor="religion" className="text-sm font-semibold">
                Religion
              </Label>
              <Input
                type="text"
                id="religion"
                {...register("religion")}
                autoComplete="off"
                placeholder="Religion"
                className={
                  errors.religion ? "border-red-500 focus:ring-red-500" : ""
                }
              />
              {errors.religion && (
                <p className="text-red-500 text-sm ml-1">
                  {errors.religion.message}
                </p>
              )}
            </div>
            <div className="w-full flex  gap-3">
              <div className="gap-2 flex flex-col ">
                <Label htmlFor="image" className="text-sm font-semibold">
                  Photo
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

              <div className="gap-2 flex flex-col ">
                <Label htmlFor="signature" className="text-sm font-semibold">
                  Director Signature
                </Label>
                <Controller
                  name="signature"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.signature?.message}
                      previewUrl="" // optional, for edit
                      maxSizeMB={1}
                    />
                  )}
                />
                {errors.signature && (
                  <p className="text-red-500 text-sm ml-1">
                    {errors.signature.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="gap-3 flex flex-col w-full">
            <Label className=" text-sm font-semibold">Course Fees</Label>
            <div className="flex-2rounded-xl w-full gap-y-4 gap-x-7 grid grid-cols-1 lg:grid-cols-2">
              {durations.map((duration, index) => (
                <div key={index} className="gap-2 flex flex-col ">
                  <Label
                    htmlFor={`coursefees.${index}.fees`}
                    className=" text-[12px] font-semibold"
                  >
                    {duration} Fees
                  </Label>
                  <Controller
                    name={`coursefees.${index}.fees`}
                    control={control}
                    rules={{ required: "Fees is required" }}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Enter fees"
                        {...field}
                        className={` w-full ${
                          errors?.coursefees?.[index]?.fees
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                    )}
                  />
                  {errors?.coursefees?.[index]?.fees && (
                    <p className="text-red-500 text-sm">
                      {errors?.coursefees?.[index]?.fees?.message}
                    </p>
                  )}
                </div>
              ))}
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

export default BranchForm;
