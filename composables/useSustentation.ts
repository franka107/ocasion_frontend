import { useAPI } from './useAPI'
import type {
  TransferenceSustentationDto,
  UploadTransferenceSustentationParamsDto,
} from '~/types/Evidence'

const BASE_SUSTENTATION_URL = '/sustentation-management'

export function useAPISustentation() {
  const uploadTransferenceSustentationFiles = async (
    values: UploadTransferenceSustentationParamsDto,
  ) => {
    const { status, error }: any = await useAPI(
      `${BASE_SUSTENTATION_URL}/upload-transference-sustentation-files`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  const uploadTransferenceSustentationFilesForParticipant = async (
    values: UploadTransferenceSustentationParamsDto,
  ) => {
    const { status, error }: any = await useAPI(
      `${BASE_SUSTENTATION_URL}/upload-transference-sustentation-files-for-participant`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  const uploadDeliverySustentationFilesForOrganization = async (
    values: UploadTransferenceSustentationParamsDto,
  ) => {
    const { status, error }: any = await useAPI(
      `${BASE_SUSTENTATION_URL}/upload-delivery-sustentation-files-for-organization`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  const uploadDeliverySustentationFilesForPlatform = async (
    values: UploadTransferenceSustentationParamsDto,
  ) => {
    const { status, error }: any = await useAPI(
      `${BASE_SUSTENTATION_URL}/upload-delivery-sustentation-files-for-platform`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  const confirmTransferenceSustentation = async (values: { id: string }) => {
    const { status, error }: any = await useAPI(
      `${BASE_SUSTENTATION_URL}/confirm-transference-sustentation`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  const confirmDeliverySustentation = async (values: { id: string }) => {
    const { status, error }: any = await useAPI(
      `${BASE_SUSTENTATION_URL}/confirm-delivery-sustentation`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  return {
    uploadTransferenceSustentationFiles,
    uploadTransferenceSustentationFilesForParticipant,
    confirmTransferenceSustentation,
    uploadDeliverySustentationFilesForPlatform,
    uploadDeliverySustentationFilesForOrganization,
    confirmDeliverySustentation,
  }
}
