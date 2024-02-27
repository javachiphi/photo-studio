'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  aspectRatioOptions,
  defaultValues,
  transformationTypes,
} from '@/constants';
import { CustomField } from './CustomField';
import { AspectRatioKey } from '@/lib/utils';

export const formSchema = z.object({
  title: z.string(),
  username: z.string().min(2).max(50),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

const TransformationForm = ({
  action,
  data = null,
  userId,
  type,
  creditBalance,
}: TransformationFormProps) => {
  const transformationType = transformationTypes[type];
  const initialValues =
    data && action === 'Update'
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(null);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const onSelectFieldHandler = (
    value: string,
    onChangeField: (value: string) => void
  ) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image title"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />
        <Button type="submit">Submit</Button>
      </form>
      {type === 'fill' && (
        <CustomField
          control={form.control}
          name="aspectRatio"
          formLabel="Aspect Ratio"
          className="w-full"
          render={({ field }) => (
            <Select
              onValueChange={(value) =>
                onSelectFieldHandler(value, field.onChange)
              }
            >
              <SelectTrigger className="select-field">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {
                  Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key}>
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  )) as React.ReactNode
                }
              </SelectContent>
            </Select>
          )}
        />
      )}
    </Form>
  );
};

export default TransformationForm;
