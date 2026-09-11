export interface AddCommentRequestDto {
  ticketId: string;
  comment: string;
  isInternal?: boolean;
}