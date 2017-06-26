package com.hubspot.singularity.mesos;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.mesos.v1.Protos.Offer;
import org.apache.mesos.v1.Protos.TaskInfo;

import com.google.common.base.Optional;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.hubspot.deploy.ExecutorData;
import com.hubspot.singularity.SingularityDeploy;
import com.hubspot.singularity.SingularityTask;
import com.hubspot.singularity.SingularityTaskRequest;
import com.hubspot.singularity.config.SingularityConfiguration;

@Singleton
public class SingularityTaskSizeOptimizer {

  private final SingularityConfiguration configuration;

  @Inject
  public SingularityTaskSizeOptimizer(SingularityConfiguration configuration) {
    this.configuration = configuration;
  }

  SingularityTask getSizeOptimizedTask(SingularityTask task) {
    if (configuration.isStoreAllMesosTaskInfoForDebugging()) {
      return task;
    }

    TaskInfo.Builder mesosTask = task.getMesosTask().toBuilder();

    mesosTask.clearData();

    List<Offer> offers = task.getOffers()
        .stream()
        .map((o) -> o.toBuilder().clearExecutorIds().clearResources().build())
        .collect(Collectors.toList());

    SingularityTaskRequest taskRequest = task.getTaskRequest();

    if (task.getTaskRequest().getDeploy().getExecutorData().isPresent()) {

      SingularityDeploy.Builder deploy = SingularityDeploy.builder().from(task.getTaskRequest().getDeploy());

      deploy.setExecutorData(Optional.<ExecutorData> absent());

      taskRequest = new SingularityTaskRequest(task.getTaskRequest().getRequest(),
          deploy.build(), task.getTaskRequest().getPendingTask());
    }

    return new SingularityTask(taskRequest, task.getTaskId(), offers, mesosTask.build(), task.getRackId());
  }

}
