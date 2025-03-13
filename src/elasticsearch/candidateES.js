import { GET_ES } from '~/config/elasticsearch';
import { candidateModel } from '~/models/candidateModel';
import { jobModel } from '~/models/jobModel';
const createNew = async (candidate, user) => {
  const job = await jobModel.findOneById(candidate.jobId);
  return await GET_ES().index({
    index: candidateModel.CANDIDATE_COLLECTION_NAME,
    id: candidate._id.toString(),
    document: {
      indoUser: {
        ...user
      },
      infoJob: {
        ...job
      }
    }
  });
};
const getListCandidates = async (user) => {
  const { body } = await GET_ES().search({
    index: candidateModel,
    size: 10000,
    body: {
      query: {
        match_all: {}
      }
    }
  });
  return body.hits.hits;
};
export const candidateES = {
  createNew,
  getListCandidates
};
