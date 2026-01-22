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
import { userSchema } from "../../extra/yup";
import { userFields } from "../../extra/formField";
import FormProvider from "../../components/formProvider";
import TextFieldFormComponent from "../../components/textFieldFormComponent";
import ButtonComponent from "../../components/buttons/formButton";
import { Router, useNavigate, useSearchParams } from "react-router-dom";
import { addUserDetails, editUserDetails, viewUserDetails } from "../../redux/actions/user-action";
import { clearDetails } from "../../redux/slices/userSlice";


const UserForm = ({ title = "User management", isEdit = false, isView = false }) => {
  const store = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id")
  const methods = useForm({
    resolver: yupResolver(userSchema),
  });


  useEffect(() => {
    if (isEdit || isView) {
      dispatch(viewUserDetails(id))
    }
   
  }, [id, isEdit, isView])

  useEffect(() => {
   if(store?.formStatues){
    navigate("/user");
   }
    return () => {
      dispatch(clearDetails())
    }
  }, [store?.formStatues])
  


  useEffect(() => {
    if (isEdit || isView) {
      setValue("first_name", store?.details?.first_name)
      setValue("last_name", store?.details?.last_name)
      setValue("email", store?.details?.email)
      setValue("phone", store?.details?.number)
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
    dispatch(isEdit ? editUserDetails({...e,_id:id}) : addUserDetails(e))
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
            fields={userFields(store, errors, isView)}
          />



          {!isView &&

            <ButtonComponent
              store={store}
              link={"/user"}
              isView={isView}
              editLink={`/user/edit?id=${id}`}
            />
          }

        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default UserForm;