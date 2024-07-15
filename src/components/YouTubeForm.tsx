import { DevTool } from "@hookform/devtools";
import { useFieldArray, useForm } from "react-hook-form";

type YouTubeFormProps = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: { number: string }[];
};

export default function YouTubeForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<YouTubeFormProps>({
    defaultValues: {
      username: "Batman",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmit = (data: YouTubeFormProps) => {
    console.log("Form submitted", data);
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          {...register("username", {
            required: {
              value: true,
              message: "Username is required!",
            },
          })}
        />
        <p className="error">{errors.username?.message}</p>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          {...register("email", {
            required: "Email is required!",
            pattern: {
              value:
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: "Invalid email format",
            },
            validate: {
              notAdmin: (fieldValue) => {
                return (
                  fieldValue !== "admin@example.com" ||
                  "Enter a different email address"
                );
              },
              notBlackListed: (fieldValue) => {
                return (
                  !fieldValue.endsWith("baddomain.com") ||
                  "This domain is not supported"
                );
              },
            },
          })}
        />
        <p className="error">{errors.email?.message}</p>

        <label htmlFor="channel">Channel</label>
        <input
          type="text"
          id="channel"
          {...register("channel", {
            required: "Channel is required!",
          })}
        />
        <p className="error">{errors.channel?.message}</p>

        <label htmlFor="twitter">Twitter</label>
        <input
          type="text"
          id="twitter"
          {...register("social.twitter", {
            required: "This field is required",
          })}
        />
        <p className="error">{errors.social?.twitter?.message}</p>

        <label htmlFor="facebook">Facebook</label>
        <input
          type="text"
          id="facebook"
          {...register("social.facebook", {
            required: "This field is required",
          })}
        />
        <p className="error">{errors.social?.facebook?.message}</p>

        <label htmlFor="primary-phone">Primary phone number</label>
        <input
          type="text"
          id="primary-phone"
          {...register("phoneNumbers.0", {
            required: "This field is required",
          })}
        />
        <p className="error">
          {errors.phoneNumbers && errors.phoneNumbers[0]?.message}
        </p>

        <label htmlFor="secondary-phone">Secondary phone number</label>
        <input
          type="text"
          id="secondary-phone"
          {...register("phoneNumbers.1", {
            required: "This field is required",
          })}
        />
        <p className="error">
          {errors.phoneNumbers && errors.phoneNumbers[1]?.message}
        </p>

        <div className="form-control">
          <label htmlFor="">Phone Numbers</label>
          {fields.map((field, index) => (
            <div key={field.id}>
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                {...register(`phNumbers.${index}.number` as const)}
              />
              {index > 0 && (
                <button type="button" onClick={() => remove(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          {fields[fields.length - 1].number !== "" && (
            <button type="button" onClick={() => append({ number: "" })}>
              Append
            </button>
          )}
        </div>

        <button>Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
}
