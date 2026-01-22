import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { homeSchema } from "../../extra/yup";
import { homeFields } from "../../extra/formField";
import FormProvider from "../../components/formProvider";
import TextFieldFormComponent from "../../components/textFieldFormComponent";
import ButtonComponent from "../../components/buttons/formButton";
import { Router, useNavigate, useSearchParams } from "react-router-dom";
// import { clearDetails } from "../../redux/slices/userSlice";
import { addHomeDetails, editHomeDetails, viewHomeDetails } from "../../redux/actions/home-action";
import { clearDetails } from "../../redux/slices/homeSlice";
import RHFSelect from "../../components/rhfSelect";
import RHFAutoComplete from "../../components/multiSelect";
import { getUserDetails } from "../../redux/actions/user-action";


const HomeForm = ({ title = "Home management", isEdit = false, isView = false }) => {
  const store = useSelector((state) => state.device);
  const {data} = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id")
  const methods = useForm({
    resolver: yupResolver(homeSchema),
  });

  useEffect(() => {
  
      dispatch(getUserDetails({ limit: 10 }))
   
  }, [])
  

// console.log("object2",data)
  useEffect(() => {
    if (isEdit || isView) {
      dispatch(viewHomeDetails(id))
    }

  }, [id, isEdit, isView])

  useEffect(() => {
    if (store?.formStatues) {
      navigate("/home");
    }
    return () => {
      dispatch(clearDetails())
    }
  }, [store?.formStatues])



  useEffect(() => {
    if (isEdit || isView) {
      setValue("name", store?.details?.name)
      setValue("user_id", store?.details?.user_id)
    }

  }, [id, isEdit, isView, store?.details?._id])




  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = methods;



  const onSubmit = async (e) => {
    console.log("object",e)
    dispatch(isEdit ? editHomeDetails({ ...e, _id: id }) : addHomeDetails(e))
  };

  return (
    <Card>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <CardHeader
          sx={{ mt: 4 }}
          title={title}
          titleTypographyProps={{ variant: "h6" }}
        />
      </Box>
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <TextFieldFormComponent
            fields={homeFields(store, errors, isView)}
          />

            <Grid item mt={5} xs={12} md={6}>
             <RHFSelect disabled={isView} name="user_id" label="User">
              <option value="">Select User</option>
              {data?.data?.map((item) => (
                <option key={item._id} value={item?._id}>
                  {item?.first_name}
                </option>
              ))}
            </RHFSelect>
          </Grid>


          {!isView &&

            <ButtonComponent
              store={store}
              link={"/home"}
              isView={isView}
              editLink={`/home/edit?id=${id}`}
            />
          }

        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default HomeForm;