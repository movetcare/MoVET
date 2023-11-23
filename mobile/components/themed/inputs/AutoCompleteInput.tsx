import { useCallback, useState } from "react";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Controller } from "react-hook-form";
import { FormFieldError } from "./InputFieldError";
import tw from "tailwind";
import { useColorScheme } from "react-native";
import { View } from "../View";
import { BodyText } from "../Text";

export const AutoCompleteInput = ({
  control,
  error,
  name,
  values,
  watch,
  placeholderText = "Select an Option...",
}: {
  control: any;
  error: any;
  name: string;
  values: Array<
    | any
    | {
        id: string;
        title: string;
      }
  >;
  watch: any;
  placeholderText?: string;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  const [isLoading, setLoading] = useState<boolean>(false);
  const [suggestionsList, setSuggestionsList] = useState<any>(values || null);
  const textColor = isDarkMode
    ? tw.color("movet-white")
    : tw.color("movet-black");
  const backgroundColor = isDarkMode
    ? tw.color("movet-black")
    : tw.color("movet-white");
  const watchValue = watch(name);

  const filterData = useCallback(
    async (query: any) => {
      if (typeof query !== "string" || query.length < 3) {
        setSuggestionsList(null);
        return;
      }
      setLoading(true);
      const suggestions = values.filter(
        (option: { id: string; title: string }) =>
          option.title.toString().toLowerCase().indexOf(query.toLowerCase()) >=
          0,
      );
      setSuggestionsList(suggestions);
      setLoading(false);
    },
    [values],
  );

  return (
    <>
      <View style={tw`flex-row flex mt-4 mb-2 z-50`}>
        <Controller
          name={name}
          rules={{
            required: "A Selection is Required",
          }}
          control={control}
          render={({ field: { onChange } }) => (
            <AutocompleteDropdown
              initialValue={watchValue || undefined}
              loading={isLoading}
              onChangeText={filterData}
              onSelectItem={(item: any) => item && onChange(item.id)}
              dataSet={suggestionsList}
              textInputProps={{
                placeholder: placeholderText,
                placeholderTextColor: textColor,
                autoCorrect: false,
                autoCapitalize: "none",
                style: {
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: textColor,
                  backgroundColor: backgroundColor,
                  color: textColor,
                  paddingLeft: 18,
                },
              }}
              rightButtonsContainerStyle={{
                borderRadius: 25,
                right: 8,
                height: 30,
                top: 10,
                alignSelf: "center",
                backgroundColor: backgroundColor,
              }}
              inputContainerStyle={{
                backgroundColor: backgroundColor,
              }}
              suggestionsListContainerStyle={
                {
                  backgroundColor: backgroundColor,
                  color: textColor,
                } as any
              }
              containerStyle={{ flexGrow: 1, flexShrink: 1 }}
              renderItem={(item: { id: string; title: string }) => (
                <BodyText
                  style={tw`
                    text-movet-black dark:text-movet-white text-lg py-4 ml-4`}
                >
                  {item.title}
                </BodyText>
              )}
              inputHeight={50}
            />
          )}
        />
      </View>
      <View style={tw`flex flex-row justify-center items-center`}>
        {error && <FormFieldError>{error}</FormFieldError>}
      </View>
    </>
  );
};
