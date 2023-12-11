import type { Metadata } from 'next';
import MemberContent from './MemberContent';

export const metadata: Metadata = {
  title: 'Member page',
  description: 'Member page',
}

const Member = () => (
  <div>
    <h1>Member</h1>
    <MemberContent />
  </div>
);

export default Member;
