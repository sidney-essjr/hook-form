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
  age: number;
  dob: Date;
};

let renderCount = 0;

export default function YouTubeForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
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
      age: 0,
      dob: new Date(),
    },
  });

  // const [watchedField, setWatchedField] = useState<
  //   | (
  //       | {
  //           number?: string | undefined;
  //         }
  //       | undefined
  //     )[]
  //   | undefined
  // >([]);

  renderCount = renderCount + 1 / 2;

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmit = (data: YouTubeFormProps) => {
    console.log("Form submitted", data);
    reset();
  };

  function handleGetValues() {
    console.log(getValues(["username", "age"]));
  }

  // Observer pattern utilizado para evitar novas renderizações desnecessarias
  // useEffect(() => {
  //   const subs = watch((value) => {
  //     setWatchedField(value.phNumbers);
  //   });

  //   return () => subs.unsubscribe();
  // },[watch]);

  const phNumberWatch = watch("phNumbers");

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>You Tube Form {renderCount}</h1>
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
          {phNumberWatch[fields.length - 1].number !== "" && (
            <button type="button" onClick={() => append({ number: "" })}>
              Append
            </button>
          )}
        </div>

        <div>
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            min={0}
            {...register("age", {
              required: "Age is required",
              valueAsNumber: true,
            })}
          />
        </div>

        <div>
          <label htmlFor="dob">Date of birth</label>
          <input
            type="datetime-local"
            id="dob"
            {...register("dob", {
              required: "Date of birth is required",
              valueAsDate: true,
            })}
          />
        </div>

        <button>Submit</button>
        <button type="button" onClick={handleGetValues}>
          Get values
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
}
